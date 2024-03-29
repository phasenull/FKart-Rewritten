import { useQuery } from "react-query";
import Application from "../Application";
import { AxiosResponse } from "axios";
import { BaseKentKartResponse } from "../enums/BasicKentKartResponse";
import { IProducts } from "../interfaces/Products";
import Logger from "../Logger";

async function getProducts() : Promise<AxiosResponse<BaseKentKartResponse & IProducts>>{
	const url = `https://service.kentkart.com/rl1/api/products?region=${Application.region}&lang=tr&authType=4`
	
	Logger.info("REQUEST useGetProducts")
	return Application.makeRequest(url)
}

export function useGetProducts() {
	return useQuery(["GetProducts"], getProducts, { staleTime: Infinity })
}