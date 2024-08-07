import { useQuery } from "react-query"
import axios, { AxiosResponse } from "axios"
import Logger from "common/Logger"
import ApplicationConfig from "common/ApplicationConfig"
import BaseFKartResponse from "common/interfaces/FKart/BaseFKartResponse"
import Captcha from "common/interfaces/FKart/Captcha"

async function FetchCaptcha(): Promise<
	AxiosResponse<
		BaseFKartResponse & {
			captcha: Captcha
		}
	>
> {
	Logger.info("REQUEST fetchCaptcha")
	return axios(`${ApplicationConfig.fkart_endpoints.antir2d2}/challange`, { method: "POST" })
}

export default function useFetchCaptcha() {
	return useQuery(["fetchCaptcha"], ()=>FetchCaptcha(), { staleTime: 30 * 1000, enabled: false,retry:false })
}
