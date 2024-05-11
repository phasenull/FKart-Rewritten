import { useQuery } from "react-query";
import { AxiosResponse } from "axios";
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse";
import Logger from "common/Logger";
import Application from "common/Application";

async function getTemplate() : Promise<AxiosResponse<BaseKentKartResponse & {
}>> {
	Logger.info("REQUEST templateHook")
	return Application.makeKentKartRequest(``)
}

export default function useGetTemplate() {
	return useQuery(["templateKey"], getTemplate, {})
}