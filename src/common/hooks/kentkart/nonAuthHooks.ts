import { useMutation, useQuery } from "react-query"
import ApplicationConfig from "common/ApplicationConfig"
import axios, { AxiosResponse } from "axios"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import { ICityInformation } from "common/interfaces/KentKart/CityInformation"
import Logger from "common/Logger"
import { KentKartAnnouncement } from "common/interfaces/KentKart/KentKartAnnouncement"
import RouteData from "common/interfaces/KentKart/RouteData"
import { IProducts } from "common/interfaces/KentKart/Products"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import BaseFKartResponse from "common/interfaces/FKart/BaseFKartResponse"
import { Buffer } from "buffer"
import IRTBus from "common/interfaces/KentKart/RTBus"
import { transit_realtime } from "gtfs-realtime-bindings"
import Card from "common/classes/Card"
import CardTypes from "common/enums/CardTypes"
export function useGetAnnouncements() {
	const region = useKentKartAuthStore((state) => state.region) as string
	return useQuery(
		["announcements", region],
		(): Promise<
			AxiosResponse<
				BaseKentKartResponse & {
					announceList: KentKartAnnouncement[]
				}
			>
		> => {
			Logger.info("REQUEST useGetAnnouncements")
			return ApplicationConfig.makeKentKartRequest(`${ApplicationConfig.endpoints.service}/rl1/api/info/announce?region=${region}`)
		},
		{ staleTime: Infinity }
	)
}

export function useGetCityList() {
	return useQuery(
		"city",
		(): Promise<
			AxiosResponse<
				BaseKentKartResponse & {
					city: ICityInformation[]
				}
			>
		> => {
			Logger.info("REQUEST useGetCityData")
			return ApplicationConfig.makeKentKartRequest(`${ApplicationConfig.endpoints.service}/rl1/api/v2.0/city`)
		},
		{ staleTime: Infinity, cacheTime: 24 * 60 * 60 * 1000 }
	)
}

export function useGetProducts() {
	const region = useKentKartAuthStore((state) => state.region) as string
	return useQuery(
		["GetProducts", region],
		(): Promise<AxiosResponse<BaseKentKartResponse & IProducts>> => {
			const url = `https://service.kentkart.com/rl1/api/products?region=${region}`

			Logger.info("REQUEST useGetProducts")
			return ApplicationConfig.makeKentKartRequest(url)
		},
		{ staleTime: Infinity }
	)
}
const ROUTE_INFO_URL = `${ApplicationConfig.endpoints.service}/rl1/api/v2.0/route/info`
const LEGACY_PATH_INFO_URL = `${ApplicationConfig.endpoints.service}/rl1/web/pathInfo`

/**
 * Route details. KentKart closed /web/pathInfo (code 34 / 403) in Nov 2026,
 * /rl1/api/v2.0/route/info returns the same pathList shape and needs no login.
 * The legacy endpoint is only tried when route/info has nothing.
 */
export async function fetchRouteInfo(params: Record<string, string>): Promise<AxiosResponse<BaseKentKartResponse & { pathList: Array<RouteData> }>> {
	const primary = await ApplicationConfig.makeKentKartRequest(ROUTE_INFO_URL, { method: "GET", params: params, timeout: 15_000 })
	if (primary?.data?.pathList?.length) return primary
	try {
		const legacy = await ApplicationConfig.makeKentKartRequest(LEGACY_PATH_INFO_URL, { method: "GET", params: params, timeout: 15_000 })
		if (legacy?.data?.pathList?.length) return legacy
	} catch (e) {
		Logger.warning("fetchRouteInfo", "legacy pathInfo failed", `${e}`)
	}
	return primary
}

// internal routeCode (what favorites store) -> displayRouteCode (what the API takes)
let route_code_cache: { region: string; map: Record<string, string> } | undefined
export async function getDisplayRouteCodes(region: string): Promise<Record<string, string>> {
	if (route_code_cache?.region === region) return route_code_cache.map
	const response = await axios(`${ApplicationConfig.endpoints.service}/rl1/api/v2.0/route/list?region=${region}`, { timeout: 15_000 })
	const map: Record<string, string> = {}
	for (const route of response.data?.routeList || []) map[route.routeCode] = route.displayRouteCode
	if (Object.keys(map).length) route_code_cache = { region, map }
	return map
}

/** Live buses of the given routes from route/info busList, shaped like GTFS-RT FeedEntities. */
async function getRealtimeFromRouteInfo(region: string, route_codes: string[]): Promise<transit_realtime.IFeedEntity[]> {
	const display_codes = await getDisplayRouteCodes(region)
	const jobs = route_codes.flatMap((route_code) =>
		[0, 1].map(async (direction) => {
			const display_code = display_codes[route_code] || route_code
			const response = await fetchRouteInfo({
				region: region,
				lang: "tr",
				direction: `${direction}`,
				displayRouteCode: display_code,
				resultType: "010000",
			})
			const path = response?.data?.pathList?.at(0)
			return (path?.busList || [])
				.map((bus) => {
					return {
						id: `${bus.busId}`,
						vehicle: {
							trip: { tripId: bus.tripId || "", routeId: `${route_code}|${direction}`, directionId: direction },
							position: { latitude: parseFloat(bus.lat), longitude: parseFloat(bus.lng), bearing: parseFloat(bus.bearing) || 0, speed: 0 },
							currentStopSequence: parseInt(bus.seq) || 0,
							timestamp: `${Math.floor(Date.now() / 1000)}`,
							stopId: bus.stopId || "",
							vehicle: {
								// same layout as the GTFS-RT vehicle id: busId|disabledPerson|?|?|vehicleType|?|?|pickMeUp
								id: [bus.busId, bus.disabledPerson || "0", "0", "0", bus.vehicleType || "3", "0", "0", bus.pickMeUp || "0"].join("|"),
								label: bus.busLabel || path?.headSign || display_code,
								licensePlate: bus.plateNumber || bus.busId,
							},
						},
					} as any as transit_realtime.IFeedEntity
				})
				.filter((e) => isFinite(e.vehicle?.position?.latitude as number) && isFinite(e.vehicle?.position?.longitude as number))
		})
	)
	const settled = await Promise.allSettled(jobs)
	const ok = settled.filter((e) => e.status === "fulfilled") as PromiseFulfilledResult<transit_realtime.IFeedEntity[]>[]
	if (!ok.length && settled.length) throw (settled[0] as PromiseRejectedResult).reason
	return ok.flatMap((e) => e.value)
}

class RealtimeError extends Error {
	code?: number
	constructor(message: string, code?: number) {
		super(message)
		this.code = code
	}
}

/** GTFS-RT feed from /rl1/api (the root /api server answers 503). Throws on KentKart JSON errors instead of returning an empty feed. */
async function fetchGtfsRealtime(region: string, access_token: string, auth_type: string): Promise<transit_realtime.IFeedEntity[]> {
	const url = `${ApplicationConfig.endpoints.service}/rl1/api/gtfs/realtime?${new URLSearchParams({
		region: region,
		antiCache: `${Math.random()}`,
		token: access_token,
		authType: auth_type,
	})}`
	const request = await axios.get(url, { timeout: 20_000, responseType: "arraybuffer" })
	const bytes = new Uint8Array(request.data)
	// KentKart answers errors as JSON ({"result":{"code":33,...}}) with status 200
	if (bytes[0] === 0x7b) {
		let result: any
		try {
			result = JSON.parse(Buffer.from(bytes).toString("utf-8"))?.result
		} catch {}
		throw new RealtimeError(`${result?.message || "Realtime feed returned an error"} (code ${result?.code ?? "?"})`, result?.code)
	}
	if (bytes.byteLength <= 15) return []
	return transit_realtime.FeedMessage.decode(bytes).entity || []
}

/**
 * @param fallback_route_codes internal routeCodes whose live buses are read from route/info when the GTFS-RT feed fails or is empty
 */
export function useGetRealtime(fallback_route_codes?: string[]) {
	const { region, credentials, auth_type, fetchAccessToken } = useKentKartAuthStore()
	const access_token = credentials?.access_token
	const fallback_key = (fallback_route_codes || []).slice().sort().join(",")
	return useQuery({
		queryFn: async (): Promise<{ feed: transit_realtime.IFeedEntity[]; source: "gtfs" | "route_info" }> => {
			Logger.info("REQUEST useGetRealtime")
			let rt_error: any
			if (region && access_token) {
				try {
					let feed: transit_realtime.IFeedEntity[]
					try {
						feed = await fetchGtfsRealtime(region, access_token, auth_type || "4")
					} catch (e) {
						// code 33: token expired, refresh once and retry
						if (!(e instanceof RealtimeError && e.code === 33)) throw e
						const [new_token] = await fetchAccessToken()
						if (!new_token) throw e
						feed = await fetchGtfsRealtime(region, new_token as string, auth_type || "4")
					}
					if (feed.length) return { feed, source: "gtfs" }
					rt_error = new Error("Realtime feed is empty")
				} catch (e) {
					rt_error = e
					Logger.warning("useGetRealtime", "gtfs realtime failed", `${(e as any)?.message || e}`)
				}
			} else {
				rt_error = new Error("Log in to your KentKart account to see live buses")
			}
			if (region && fallback_route_codes?.length) {
				return { feed: await getRealtimeFromRouteInfo(region, fallback_route_codes), source: "route_info" }
			}
			throw rt_error
		},
		queryKey: ["realtime", region, !!access_token, fallback_key],
		keepPreviousData: true,
		refetchInterval: 10 * 1000,
		retry: 1,
		onError: (e: any) => console.log("failed to fetch realtime", e?.message),
	})
}
export function useGetRouteDetails(args: {
	route_code: string
	interval?: number
	direction: number
	user: IKentKartUser
	result_includes?: {
		pointList?: boolean
		busList?: boolean
		busStopList?: boolean
		timeTableList?: boolean
		stopTimeList?: boolean
		scheduleList?: boolean
	}
}) {
	const { direction, route_code, interval } = args
	const resulType = {
		pointList: (args.result_includes?.pointList && "1") || "0",
		busList: (args.result_includes?.busList && "1") || "0",
		busStopList: (args.result_includes?.busStopList && "1") || "0",
		timeTableList: (args.result_includes?.timeTableList && "1") || "0",
		stopTimeList: "1",//(args.result_includes?.stopTimeList && "1") || "0",
		scheduleList: (args.result_includes?.scheduleList && "1") || "0",
	}
	const resultTypeString = Object.values(resulType).join("")
	const region = useKentKartAuthStore((state) => state.region) as string
	const access_token = useKentKartAuthStore((state) => state.credentials?.access_token)
	return useQuery(
		["getRouteDetails", { displayRouteCode: route_code, direction: direction, region: region }],
		(): Promise<
			AxiosResponse<
				BaseKentKartResponse & {
					pathList: Array<RouteData>
				}
			>
		> => {
			const params: Record<string, string> = {
				region: region,
				lang: "tr",
				authType: "4",
				...(access_token ? { token: access_token } : {}),
				direction: direction.toString(),
				// todo: remove direction and fix references so it wont have to refresh just to switch directions
				displayRouteCode: route_code,
				resultType: resultTypeString,
				ignore_cache_with: `${Math.random() * 10000}-${Math.random() * 10000}`,
			}
			Logger.info(`REQUEST useGetRouteDetails ${route_code} ${direction}`)
			return fetchRouteInfo(params)
		},
		{ refetchInterval: interval,staleTime:3*1000 }
	)
}
export function useSetCardType() {
	return useMutation({
		mutationKey: ["setCardType"],
		mutationFn: async (args: { alias_no: string; card_type: CardTypes }) => {
			return await ApplicationConfig.database.set(`card__${args.alias_no}`, args.card_type)
		},
	})
}
export function useGetCardType(alias_no: string) {
	return useQuery({
		queryKey: ["getCardType", alias_no],
		queryFn: async () => {
			return Card.getTypeFromAliasNo(alias_no)
		},
		staleTime: Infinity,
	})
}
