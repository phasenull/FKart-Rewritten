import { useQuery } from "react-query";
import Application from "../Application";
import { AxiosResponse } from "axios";
import { BaseKentKartResponse } from "../enums/BasicKentKartResponse";
import { ICityInformation } from "../interfaces/CityInformation";
import Logger from "../Logger";

async function getCityData() : Promise<AxiosResponse<BaseKentKartResponse & {
	city: ICityInformation[]
}>> {
	Logger.info("REQUEST useGetCityData")
	return Application.makeRequest(`${Application.endpoints.service}/rl1/api/v2.0/city`)
}

export default function useGetCityData() {
	return useQuery("city", getCityData, { staleTime: Infinity})
}