import { useQuery } from "react-query";
import ApplicationConfig from "common/ApplicationConfig";
import { AxiosResponse } from "axios";
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse";
import { ICityInformation } from "common/interfaces/KentKart/CityInformation";
import Logger from "common/Logger";
import { KentKartAnnouncement } from "common/interfaces/KentKart/KentKartAnnouncement";

async function getAnnouncements({ region }: { region: string }) : Promise<AxiosResponse<BaseKentKartResponse & {
	announceList:KentKartAnnouncement[]
}>> {
	Logger.info("REQUEST useGetAnnouncements")
	return ApplicationConfig.makeKentKartRequest(`${ApplicationConfig.endpoints.service}/rl1/api/info/announce?region=${region}`)
}

export function useGetAnnouncements() {
	const region = ApplicationConfig.region
	return useQuery(["announcements", region], ()=>getAnnouncements({region:region}), { staleTime: Infinity})
}