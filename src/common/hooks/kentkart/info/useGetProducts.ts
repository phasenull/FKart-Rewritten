import { useQuery } from "react-query";
import ApplicationConfig from "common/ApplicationConfig";
import { AxiosResponse } from "axios";
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse";
import { IProducts } from "common/interfaces/KentKart/Products";
import Logger from "common/Logger";

async function getProducts() : Promise<AxiosResponse<BaseKentKartResponse & IProducts>>{
	const url = `https://service.kentkart.com/rl1/api/products?region=${ApplicationConfig.region}&lang=tr&authType=4`
	
	Logger.info("REQUEST useGetProducts")
	return ApplicationConfig.makeKentKartRequest(url)
}

export function useGetProducts() {
	return useQuery(["GetProducts"], getProducts, { staleTime: Infinity })
}