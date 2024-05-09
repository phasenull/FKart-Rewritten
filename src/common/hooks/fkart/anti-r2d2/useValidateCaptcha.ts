import { useQuery } from "react-query"
import axios, { AxiosResponse } from "axios"
import Logger from "../../../Logger"
import Application from "../../../Application"
import BaseFKartResponse from "../../../interfaces/BaseFKartResponse"
import Captcha from "../../../interfaces/FKart/Captcha"

async function FetchCaptcha(): Promise<
	AxiosResponse<
		BaseFKartResponse & {
			captcha: Captcha
		}
	>
> {
	Logger.info("REQUEST validateCaptcha")
	return axios(`${Application.fkart_endpoints.antir2d2}/validate`,{method:"POST"})
}

export default function useFetchCaptcha() {
	return useQuery(["validateCaptcha"], FetchCaptcha, {staleTime:30*1000})
}
