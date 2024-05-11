import { useQuery } from "react-query"
import Application from "common/Application"
import BasicRouteInformation from "common/interfaces/KentKart/BasicRouteInformation"
import Logger from "common/Logger"
import { AxiosResponse } from "axios"
import BusData from "common/interfaces/KentKart/BusData"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import RouteData from "common/interfaces/KentKart/RouteData"

async function getRouteDetails({ route_code, direction, include_time_table = false }: { route_code: string; direction: number; include_time_table?: boolean }): Promise<
	AxiosResponse<
		BaseKentKartResponse & {
			pathList: Array<RouteData>
		}
	>
> {
	const url = `${Application.endpoints.service}/rl1/api/v2.0/route/info`
	const params: Record<string, string> = {
		region: Application.region,
		lang: "tr",
		// authType: "4",
		direction: direction.toString(),
		displayRouteCode: route_code,
		resultType: include_time_table ? "111111" : "010000",
		// 111111: with timetable
		// 010000: without timetable, only bus points
	}
	Logger.info(`REQUEST useGetRouteDetails ${route_code} ${direction} ${include_time_table}`)
	const request = Application.makeKentKartRequest(url, {
		method: "GET",
		params: params,
	})
	return request
}

export default function useGetRouteDetails({
	route_code,
	direction,
	include_time_table = false,
	interval,
}: {
	route_code: string
	interval?: number
	direction: number
	include_time_table?: boolean
}) {
	return useQuery(
		["getRouteDetails", route_code, direction, include_time_table],
		() =>
			getRouteDetails({
				route_code,
				direction,
				include_time_table,
			}),
		{ staleTime: 5000, refetchInterval: interval }
	)
}
