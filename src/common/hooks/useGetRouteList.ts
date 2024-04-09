import { useQuery } from "react-query"
import Application from "../Application"
import Logger from "../Logger"
import { AxiosResponse } from "axios"
import { BaseKentKartResponse } from "../enums/BasicKentKartResponse"
import BasicRouteInformation from "../interfaces/BasicRouteInformation"

async function getRouteList({ region }: { region: string }): Promise<AxiosResponse<BaseKentKartResponse & { routeList: BasicRouteInformation[] }>> {
	Logger.info("REQUEST useGetRouteList")
	return Application.makeKentKartRequest(`${Application.endpoints.service}/rl1/web/nearest/find?region=${region}`)
}

export default function useGetRouteList({ region }: { region: string }) {
	return useQuery(["route_list", region], () => getRouteList({ region }), { staleTime: Infinity })
}
