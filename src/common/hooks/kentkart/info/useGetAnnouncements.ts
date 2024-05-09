import { useQuery } from "react-query";
import Application from "../../../Application";
import { AxiosResponse } from "axios";
import { BaseKentKartResponse } from "../../../interfaces/KentKart/BaseKentKartResponse";
import { ICityInformation } from "../../../interfaces/KentKart/CityInformation";
import Logger from "../../../Logger";
import { KentKartAnnouncement } from "../../../interfaces/KentKart/KentKartAnnouncement";

async function getAnnouncements({ region }: { region: string }) : Promise<AxiosResponse<BaseKentKartResponse & {
	announceList:KentKartAnnouncement[]
}>> {
	Logger.info("REQUEST useGetAnnouncements")
	return Application.makeKentKartRequest(`${Application.endpoints.service}/rl1/api/info/announce?region=${region}`)
}

export function useGetAnnouncements() {
	const region = Application.region
	return useQuery(["announcements", region], ()=>getAnnouncements({region:region}), { staleTime: Infinity})
}