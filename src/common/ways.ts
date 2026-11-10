import ApplicationConfig from "common/ApplicationConfig"
import { fetchRouteInfo } from "common/hooks/kentkart/nonAuthHooks"
import BasicStopInformation from "common/interfaces/KentKart/BasicStopInformation"
import BusData from "common/interfaces/KentKart/BusData"
import RouteData from "common/interfaces/KentKart/RouteData"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { useQuery } from "react-query"

/**
 * A "way" is a saved journey: segments of stop A → stop B (→ C …).
 * Ways are route agnostic: every route that stops at A and then at B, lets you get on at A
 * and get off at B (busStopList pickupType / dropoffType) is an option of that segment.
 */
export interface WayStop {
	id: string
	name: string
	lat?: number
	lng?: number
	/** display route codes stopping here, from busStopList.routes (comma separated) */
	routes?: string
}
export interface WaySegment {
	from: WayStop
	to: WayStop
	/** routes to try when the stops have no route list yet (ways migrated from v1) */
	hint_routes?: string[]
}
export interface Way {
	id: string
	name: string
	segments: WaySegment[]
}
export interface WayOption {
	route_code: string // displayRouteCode
	direction: 0 | 1
	headsign: string
}

/** distinct colors for the routes of one way (KentKart gives most buses the same route color) */
export const WAY_COLORS = ["#E95555", "#1E88E5", "#43A047", "#8E24AA", "#FB8C00", "#00897B", "#6D4C41", "#D81B60", "#3949AB", "#7CB342", "#F4511E", "#5E35B1"]
export function optionKey(option: WayOption) {
	return `${option.route_code}|${option.direction}`
}
export function colorsFor(options: WayOption[][]): Record<string, string> {
	const colors: Record<string, string> = {}
	for (const list of options)
		for (const option of list) {
			const key = optionKey(option)
			if (!colors[key]) colors[key] = WAY_COLORS[Object.keys(colors).length % WAY_COLORS.length]
		}
	return colors
}

// MARK: storage
const WAYS_KEY = "ways.v2"
const OLD_WAYS_KEY = "ways.v1"

export async function getWays(): Promise<Way[]> {
	const value = await ApplicationConfig.database.get(WAYS_KEY)
	if (Array.isArray(value)) return value
	// v1 ways were single-bus legs; each leg becomes a segment between its stops
	const old = await ApplicationConfig.database.get(OLD_WAYS_KEY)
	if (!Array.isArray(old)) return []
	const migrated: Way[] = old.map((way: any) => ({
		id: way.id,
		name: way.name,
		segments: (way.legs || []).map((leg: any) => ({
			from: { id: leg.board_stop_id, name: leg.board_stop_name },
			to: { id: leg.alight_stop_id, name: leg.alight_stop_name },
			hint_routes: [leg.route_code],
		})),
	}))
	await ApplicationConfig.database.set(WAYS_KEY, migrated)
	return migrated
}
export function useWays() {
	return useQuery(["ways"], getWays, { staleTime: Infinity })
}
export async function saveWay(way: Way) {
	const ways = await getWays()
	const index = ways.findIndex((e) => e.id === way.id)
	if (index === -1) ways.push(way)
	else ways[index] = way
	await ApplicationConfig.database.set(WAYS_KEY, ways)
}
export async function deleteWay(id: string) {
	const ways = await getWays()
	await ApplicationConfig.database.set(
		WAYS_KEY,
		ways.filter((e) => e.id !== id)
	)
}

// MARK: route stops (cached; stop lists rarely change)
const stops_cache = new Map<string, Promise<RouteData | undefined>>()
/** route/info with pointList + busStopList for one route/direction, cached for the session */
export function getRouteShape(region: string, route_code: string, direction: number) {
	const key = `${region}|${route_code}|${direction}`
	if (!stops_cache.has(key)) {
		const promise = fetchRouteInfo({ region, lang: "tr", direction: `${direction}`, displayRouteCode: route_code, resultType: "101000" })
			.then((e) => e?.data?.pathList?.at(0))
			.catch(() => {
				stops_cache.delete(key)
				return undefined
			})
		stops_cache.set(key, promise)
	}
	return stops_cache.get(key) as Promise<RouteData | undefined>
}
export function routeCodesAt(stop?: { routes?: string }) {
	return (stop?.routes || "")
		.split(",")
		.map((e) => e.trim())
		.filter(Boolean)
}
const canBoard = (stop: BasicStopInformation) => `${stop.pickupType ?? "0"}` !== "1"
const canLeave = (stop: BasicStopInformation) => `${stop.dropoffType ?? "0"}` !== "1"

/** directions of a route where you can board at `from_id`, as index into its busStopList */
export async function boardableDirections(region: string, route_code: string, from_id: string) {
	const found: { direction: 0 | 1; path: RouteData; from_index: number }[] = []
	for (const direction of [0, 1] as const) {
		const path = await getRouteShape(region, route_code, direction)
		const stops = path?.busStopList || []
		const from_index = stops.findIndex((e) => e.stopId === from_id && canBoard(e))
		if (path && from_index !== -1) found.push({ direction, path, from_index })
	}
	return found
}

/** stops you can get off at after boarding at `from` on any route stopping there */
export async function reachableStops(region: string, from: WayStop) {
	const result: { stop: BasicStopInformation; routes: string[] }[] = []
	const by_id = new Map<string, { stop: BasicStopInformation; routes: string[] }>()
	const lines: { route_code: string; direction: 0 | 1; path: RouteData }[] = []
	await Promise.all(
		routeCodesAt(from).map(async (code) => {
			for (const { direction, path, from_index } of await boardableDirections(region, code, from.id)) {
				lines.push({ route_code: code, direction, path })
				for (const stop of path.busStopList.slice(from_index + 1)) {
					if (!canLeave(stop) || stop.stopId === from.id) continue
					const entry = by_id.get(stop.stopId)
					if (entry) entry.routes.includes(code) || entry.routes.push(code)
					else {
						const created = { stop, routes: [code] }
						by_id.set(stop.stopId, created)
						result.push(created)
					}
				}
			}
		})
	)
	return { stops: result, lines }
}

/** every route/direction that goes from `from` to `to` with boarding and alighting allowed */
export async function resolveSegment(region: string, segment: WaySegment): Promise<WayOption[]> {
	let from_routes = routeCodesAt(segment.from)
	let to_routes = routeCodesAt(segment.to)
	if ((!from_routes.length || !to_routes.length) && segment.hint_routes?.length) {
		// stops saved without their route list: read it from a known route
		for (const code of segment.hint_routes)
			for (const direction of [0, 1]) {
				const stops = (await getRouteShape(region, code, direction))?.busStopList || []
				from_routes = from_routes.length ? from_routes : routeCodesAt(stops.find((e) => e.stopId === segment.from.id))
				to_routes = to_routes.length ? to_routes : routeCodesAt(stops.find((e) => e.stopId === segment.to.id))
			}
		if (!from_routes.length || !to_routes.length) from_routes = to_routes = segment.hint_routes
	}
	const candidates = from_routes.filter((code) => to_routes.includes(code))
	const options: WayOption[] = []
	await Promise.all(
		candidates.map(async (code) => {
			for (const { direction, path, from_index } of await boardableDirections(region, code, segment.from.id)) {
				const to_index = path.busStopList.findIndex((e, i) => i > from_index && e.stopId === segment.to.id && canLeave(e))
				if (to_index !== -1) options.push({ route_code: code, direction, headsign: path.headSign })
			}
		})
	)
	return options.sort((a, b) => a.route_code.localeCompare(b.route_code, undefined, { numeric: true }) || a.direction - b.direction)
}

/** options of every segment of a way */
export function useWayOptions(way?: Way) {
	const region = useKentKartAuthStore((state) => state.region) as string
	return useQuery(
		["way_options", region, JSON.stringify(way?.segments.map((s) => [s.from.id, s.to.id]))],
		() => Promise.all((way as Way).segments.map((segment) => resolveSegment(region, segment))),
		{ enabled: !!way, staleTime: 6 * 60 * 60 * 1000 }
	)
}

// MARK: live status
export interface OptionStatus {
	option: WayOption
	/** nearest bus that has not passed the boarding stop yet */
	bus?: BusData
	/** stops between that bus and the boarding stop (0 = at the stop) */
	stops_away?: number
	/** next scheduled departure from the first stop today, when no bus is coming */
	next_departure?: string
}

/** live route/info for one option: path, buses, stops, schedule */
export function optionQuery(region: string, option: WayOption) {
	return {
		queryKey: ["way_option", region, option.route_code, option.direction],
		queryFn: async () => {
			const response = await fetchRouteInfo({
				region,
				lang: "tr",
				direction: `${option.direction}`,
				displayRouteCode: option.route_code,
				resultType: "111001",
			})
			const path = response?.data?.pathList?.at(0)
			if (!path) throw new Error(response?.data?.result?.message || `Route ${option.route_code} not found`)
			return path
		},
		refetchInterval: 15_000,
		staleTime: 10_000,
		keepPreviousData: true,
	}
}

function todayNextDeparture(path: RouteData) {
	const now = new Date()
	const now_hhmm = `${`${now.getHours()}`.padStart(2, "0")}:${`${now.getMinutes()}`.padStart(2, "0")}`
	// scheduleList: one entry per day type, description is Monday-first, uppercase = runs that day
	const today_index = (now.getDay() + 6) % 7
	const today = ((path.scheduleList || []) as { description: string; timeList: { departureTime: string }[] }[]).find((e) => {
		const c = (e.description || "")[today_index]
		return !!c && c !== c.toLowerCase()
	})
	return (today?.timeList || [])
		.map((e) => e.departureTime?.slice(0, 5))
		.filter((e) => e && e >= now_hhmm)
		.sort()
		.at(0)
}

/** which bus of this option is closest to the boarding stop without having passed it */
export function optionStatus(option: WayOption, from_stop_id: string, path?: RouteData): OptionStatus {
	if (!path) return { option }
	const stop_index = new Map((path.busStopList || []).map((stop, i) => [stop.stopId, i]))
	const board_index = stop_index.get(from_stop_id)
	let best: { bus: BusData; index: number } | undefined
	if (board_index !== undefined) {
		for (const bus of path.busList || []) {
			const index = stop_index.get(bus.stopId)
			if (index === undefined || index > board_index) continue
			if (!best || index > best.index) best = { bus, index }
		}
	}
	return {
		option,
		bus: best?.bus,
		stops_away: best && board_index !== undefined ? board_index - best.index : undefined,
		next_departure: todayNextDeparture(path),
	}
}

/** the best option of a segment: the bus with the fewest stops to go, else the earliest scheduled departure */
export function bestOfSegment(statuses: OptionStatus[]) {
	const with_bus = statuses.filter((e) => e.stops_away !== undefined).sort((a, b) => (a.stops_away as number) - (b.stops_away as number))
	if (with_bus.length) return with_bus[0]
	return statuses.filter((e) => e.next_departure).sort((a, b) => (a.next_departure as string).localeCompare(b.next_departure as string))[0]
}

export function describeStatus(status: OptionStatus | undefined, stop_name: string) {
	if (!status) return { text: "No bus coming", ok: false }
	if (status.bus && status.stops_away !== undefined) {
		return {
			text:
				status.stops_away === 0
					? `${status.option.route_code} · ${status.bus.plateNumber} is at ${stop_name}`
					: `${status.option.route_code} · ${status.bus.plateNumber} · ${status.stops_away} stop${status.stops_away === 1 ? "" : "s"} before ${stop_name}`,
			ok: true,
		}
	}
	if (status.next_departure) return { text: `No bus coming · ${status.option.route_code} departs ${status.next_departure}`, ok: false }
	return { text: "No bus coming", ok: false }
}
