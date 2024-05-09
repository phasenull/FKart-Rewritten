import { useQuery } from "react-query";
import Application from "../../../Application";
import { AxiosResponse } from "axios";
import { BaseKentKartResponse } from "../../../interfaces/KentKart/BaseKentKartResponse";
import { ICityInformation } from "../../../interfaces/KentKart/CityInformation";
import Logger from "../../../Logger";

async function getCityData() : Promise<AxiosResponse<BaseKentKartResponse & {
	city: ICityInformation[]
}>> {
	Logger.info("REQUEST useGetCityData")
	return Application.makeKentKartRequest(`${Application.endpoints.service}/rl1/api/v2.0/city`)
}

export default function useGetCityData() {
	return useQuery("city", getCityData, { staleTime: Infinity,cacheTime:24*60*60*1000})
}