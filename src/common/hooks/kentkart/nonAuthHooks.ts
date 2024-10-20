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
export function useGetRealtime() {
	const { region, credentials, auth_type } = useKentKartAuthStore()
	const { access_token } = credentials
	// JSON wrapper
	return useQuery({
		queryFn: async () => {
			Logger.info("REQUEST useGetRealtime")
			if (!region || !access_token) {
				return { feed: [] }
			}
			console.log("fetch start")
			const url = `${ApplicationConfig.endpoints.service}/api/gtfs/realtime?${new URLSearchParams({
				region: region,
				antiCache: `${Math.random()}`
				// token: access_token,
				// authType: auth_type,
			})}`
			let data
			const request = await axios.get(url, { timeout: 3500, responseType: "arraybuffer" })

			const buffer = await request.data
			console.log("fetch end")
			if (buffer.byteLength === 15) {
				console.log("!!! buffer empty " + Buffer.from(buffer).toString())
				return { feed: [] }
			}
			try {
				data = transit_realtime.FeedMessage.decode(new Uint8Array(buffer))
			} catch {
				console.log("buffer", buffer.byteLength)
			}
			console.log("result", data?.entity?.length)
			// const data = (await request?.json()) as { feed: IRTBus[] } & BaseFKartResponse
			return { feed: data?.entity || [] }
		},
		queryKey: ["realtime"],
		keepPreviousData: true,
		refetchInterval: 10 * 1000,
		retry: 2,
		onError: () => console.log("failed to fetch realtime"),
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
	return useQuery(
		["getRouteDetails", { displayRouteCode: route_code, direction: direction, region: region }],
		(): Promise<
			AxiosResponse<
				BaseKentKartResponse & {
					pathList: Array<RouteData>
				}
			>
		> => {
			const url = `${ApplicationConfig.endpoints.service}/rl1/web/pathInfo`
			const params: Record<string, string> = {
				region: region,
				lang: "tr",
				direction: direction.toString(),
				// todo: remove direction and fix references so it wont have to refresh just to switch directions
				displayRouteCode: route_code,
				resultType: resultTypeString,
				ignore_cache_with: `${Math.random() * 10000}-${Math.random() * 10000}`,
			}
			Logger.info(`REQUEST useGetRouteDetails ${route_code} ${direction}`)
			const request = ApplicationConfig.makeKentKartRequest(url, {
				method: "GET",
				params: params,
			})
			// request.then((e)=>{console.log(e.data.pathList[0]?.busList[0])})
			return request
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
