import { useQuery } from "react-query"
import axios, { AxiosResponse } from "axios"
import Logger from "common/Logger"
import Application from "common/Application"
import BaseFKartResponse from "common/interfaces/FKart/BaseFKartResponse"
import Captcha from "common/interfaces/FKart/Captcha"

async function ValidateCaptcha(captcha: Captcha | undefined): Promise<
	AxiosResponse<
		BaseFKartResponse & {
			captcha: Captcha,
			captcha_token:string
		}
	>
> {
	Logger.info("REQUEST validateCaptcha")
	return axios(`${Application.fkart_endpoints.antir2d2}/validate`, {
		method: "POST",
		data: JSON.stringify({
			captcha_session_id: captcha?.session_id,
			code: captcha?.__code,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	})
}

export default function useValidateCaptcha(captcha: Captcha | undefined) {
	return useQuery(["validateCaptcha", captcha?.session_id], () => ValidateCaptcha(captcha), { staleTime: 30 * 1000, enabled: false,retry:false })
}
