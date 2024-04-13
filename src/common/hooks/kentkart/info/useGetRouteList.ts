import { useQuery } from "react-query"
import Application from "../../../Application"
import Logger from "../../../Logger"
import { AxiosResponse } from "axios"
import { BaseKentKartResponse } from "../../../interfaces/KentKart/BasicKentKartResponse"
import BasicRouteInformation from "../../../interfaces/KentKart/object/BasicRouteInformation"

async function getRouteList({ region }: { region: string }): Promise<AxiosResponse<BaseKentKartResponse & { routeList: BasicRouteInformation[] }>> {
	Logger.info("REQUEST useGetRouteList")
	return Application.makeKentKartRequest(`${Application.endpoints.service}/rl1/web/nearest/find?region=${region}`)
}

export default function useGetRouteList({ region }: { region: string }) {
	return useQuery(["route_list", region], () => getRouteList({ region }), { staleTime: Infinity,cacheTime:1*60*60*1000 })
}
