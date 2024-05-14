import { useQuery } from "react-query";
import axios, { AxiosResponse } from "axios";
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse";
import Logger from "common/Logger";
import Application from "common/Application";
import ICredentials from "common/interfaces/app/Credentials";
import BaseFKartResponse from "common/interfaces/FKart/BaseFKartResponse";
import Log from "common/interfaces/FKart/Log";

export async function getLogsAsync(accessToken?:string) : Promise<AxiosResponse<BaseFKartResponse & {
logs:Log[]
}>> {
	Logger.info("REQUEST useGetLogs")
	return axios(`${Application.fkart_endpoints.auth}/user/logs`, {
		method: "POST",
		data: JSON.stringify({
			access_token:accessToken
		}),
	})
}
