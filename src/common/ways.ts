import ApplicationConfig from "common/ApplicationConfig"
import { fetchRouteInfo } from "common/hooks/kentkart/nonAuthHooks"
import BusData from "common/interfaces/KentKart/BusData"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { useQuery } from "react-query"

/**
 * A "way" is a saved journey made of one or more bus legs,
 * e.g. "Home" = one bus, or "Home via center" = two buses with a transfer.
 */
export interface WayLeg {
	route_code: string // displayRouteCode
	direction: 0 | 1
	headsign: string
	color?: string
	board_stop_id: string
	board_stop_name: string
	alight_stop_id: string
	alight_stop_name: string
}
export interface Way {
	id: string
	name: string
	legs: WayLeg[]
}

const WAYS_KEY = "ways.v1"

export async function getWays(): Promise<Way[]> {
	const value = await ApplicationConfig.database.get(WAYS_KEY)
	return Array.isArray(value) ? value : []
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
export function useWays() {
	return useQuery(["ways"], getWays, { staleTime: Infinity })
}

export interface LegStatus {
	/** nearest bus that has not passed the boarding stop yet */
	bus?: BusData
	/** how many stops the bus is before the boarding stop (0 = at the stop) */
	stops_away?: number
	/** stop the bus is at right now */
	bus_stop_name?: string
	/** next scheduled departure from the first stop, "HH:MM", when no bus is coming */
	next_departure?: string
	bus_count: number
}

/** Live status of one leg: which bus is coming to the boarding stop and how far it is. */
export function useLegStatus(leg: WayLeg) {
	const region = useKentKartAuthStore((state) => state.region) as string
	return useQuery(
		["leg_status", region, leg.route_code, leg.direction],
		async (): Promise<LegStatus> => {
			const response = await fetchRouteInfo({
				region: region,
				lang: "tr",
				direction: `${leg.direction}`,
				displayRouteCode: leg.route_code,
				// busList, busStopList, scheduleList
				resultType: "011001",
			})
			const path = response?.data?.pathList?.at(0)
			if (!path) throw new Error(response?.data?.result?.message || "Route not found")
			const stop_index = new Map((path.busStopList || []).map((stop, i) => [stop.stopId, i]))
			const board_index = stop_index.get(leg.board_stop_id)
			const buses = path.busList || []
			let best: { bus: BusData; index: number } | undefined
			if (board_index !== undefined) {
				for (const bus of buses) {
					const index = stop_index.get(bus.stopId)
					if (index === undefined || index > board_index) continue
					if (!best || index > best.index) best = { bus, index }
				}
			}
			const now = new Date()
			const now_hhmm = `${`${now.getHours()}`.padStart(2, "0")}:${`${now.getMinutes()}`.padStart(2, "0")}`
			// scheduleList has one entry per day type, description is Monday-first, uppercase = runs that day
			const today_index = (now.getDay() + 6) % 7
			const today_schedule = ((path.scheduleList || []) as { description: string; timeList: { departureTime: string }[] }[]).find((e) => {
				const c = (e.description || "")[today_index]
				return !!c && c !== c.toLowerCase()
			})
			const next_departure = (today_schedule?.timeList || [])
				.map((e) => e.departureTime?.slice(0, 5))
				.filter((e) => e && e >= now_hhmm)
				.sort()
				.at(0)
			return {
				bus: best?.bus,
				stops_away: best && board_index !== undefined ? board_index - best.index : undefined,
				bus_stop_name: best ? path.busStopList[best.index]?.stopName : undefined,
				next_departure,
				bus_count: buses.length,
			}
		},
		{ refetchInterval: 15_000, staleTime: 10_000, keepPreviousData: true }
	)
}
