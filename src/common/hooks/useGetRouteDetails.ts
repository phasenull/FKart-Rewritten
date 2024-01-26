import { useQuery } from "react-query"
import Application from "../Application"
import BasicRouteInformation from "../interfaces/BasicRouteInformation"
import Logger from "../Logger"

async function getRouteDetails({
	route_data,
	direction,
	include_time_table = false,
}: {
	route_data: BasicRouteInformation
	direction: number
	include_time_table?: boolean
}) {
	const url = `${Application.endpoints.service}/rl1/web/pathInfo`
	const params: Record<string, string> = {
		region: Application.region,
		lang: "tr",
		// authType: "4",
		direction: direction.toString(),
		displayRouteCode: route_data.displayRouteCode,
		resultType: include_time_table ? "111111" : "010000",
		// 111111: with time table
		// 010000: without time table, only bus points
	}
	Logger.info("REQUEST useGetRouteDetails")
	const request = Application.makeRequest(url, {
		method: "GET",
		params: params,
	})
	return request
}

export default function useGetRouteDetails({
	route_data,
	direction,
	include_time_table = false,
}: {
	route_data: BasicRouteInformation
	direction: number
	include_time_table?: boolean
}) {
	return useQuery(
		[
			"getRouteDetails",
			route_data,
			direction,
			include_time_table,
		],
		() =>
			getRouteDetails({
				route_data,
				direction,
				include_time_table,
			}),
		{ staleTime: include_time_table ? Infinity : 5000 }
	)
}
