import { useQuery } from "react-query";
import ApplicationConfig from "common/ApplicationConfig";
import { AxiosResponse } from "axios";
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse";
import { ICityInformation } from "common/interfaces/KentKart/CityInformation";
import Logger from "common/Logger";

async function getCityData() : Promise<AxiosResponse<BaseKentKartResponse & {
	city: ICityInformation[]
}>> {
	Logger.info("REQUEST useGetCityData")
	return ApplicationConfig.makeKentKartRequest(`${ApplicationConfig.endpoints.service}/rl1/api/v2.0/city`)
}

export default function useGetCityData() {
	return useQuery("city", getCityData, { staleTime: Infinity,cacheTime:24*60*60*1000})
}