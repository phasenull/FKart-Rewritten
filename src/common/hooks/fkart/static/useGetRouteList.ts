import { useQuery } from "react-query"
import ApplicationConfig from "common/ApplicationConfig"
import Logger from "common/Logger"
import axios, { AxiosResponse } from "axios"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import BasicRouteInformation from "common/interfaces/KentKart/BasicRouteInformation"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"

async function getRouteList({ region }: { region: string }): Promise<AxiosResponse<BaseKentKartResponse & { routeList: BasicRouteInformation[] }>> {
	Logger.info("REQUEST useGetRouteList")
	return axios(`${ApplicationConfig.fkart_endpoints.static}/kentkart/routes?region=${region}`)
}

export default function useGetRouteList() {
	const region = useKentKartAuthStore((state)=>state.region) as string
	return useQuery(["route_list", region], () => getRouteList({ region }), {staleTime:3*60*1000, cacheTime:24*60*60*1000 })
}
