import { useQuery } from "react-query"
import ApplicationConfig from "common/ApplicationConfig"
import { AxiosResponse } from "axios"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import { ICityInformation } from "common/interfaces/KentKart/CityInformation"
import Logger from "common/Logger"
import { KentKartAnnouncement } from "common/interfaces/KentKart/KentKartAnnouncement"
import RouteData from "common/interfaces/KentKart/RouteData"
import { IProducts } from "common/interfaces/KentKart/Products"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"

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

export function useGetRouteDetails(args: {
	route_code: string
	interval?: number
	direction: number
	include_time_table?: boolean
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
	const { direction, route_code, include_time_table, interval } = args
	const resulType = {
		pointList: (args.result_includes?.pointList && "1") || "0",
		busList: (args.result_includes?.busList && "1") || "0",
		busStopList: (args.result_includes?.busStopList && "1") || "0",
		timeTableList: (args.result_includes?.timeTableList && "1") || "0",
		stopTimeList: (args.result_includes?.stopTimeList && "1") || "0",
		scheduleList: (args.result_includes?.scheduleList && "1") || "0",
	}
	const region = useKentKartAuthStore((state) => state.region) as string
	return useQuery(
		["getRouteDetails", route_code, direction, include_time_table, region],
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
				// authType: "4",
				direction: direction.toString(),
				// todo: remove direction and fix references so it wont have to refresh just to switch directions
				displayRouteCode: route_code,
				resultType: Object.values(resulType).join(""),
			}
			Logger.info(`REQUEST useGetRouteDetails ${route_code} ${direction} ${include_time_table}`)
			const request = ApplicationConfig.makeKentKartRequest(url, {
				method: "GET",
				params: params,
			})
			return request
		},
		{ staleTime: 3000, refetchInterval: interval }
	)
}
