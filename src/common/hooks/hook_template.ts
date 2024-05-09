import { useQuery } from "react-query";
import { AxiosResponse } from "axios";
import { BaseKentKartResponse } from "../interfaces/KentKart/BaseKentKartResponse";
import Logger from "../Logger";
import Application from "../Application";

async function getTemplate() : Promise<AxiosResponse<BaseKentKartResponse & {
}>> {
	Logger.info("REQUEST templateHook")
	return Application.makeKentKartRequest(``)
}

export default function useGetTemplate() {
	return useQuery(["templateKey"], getTemplate, {})
}