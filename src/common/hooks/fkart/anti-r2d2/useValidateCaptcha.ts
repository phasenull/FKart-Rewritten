import { useQuery } from "react-query"
import axios, { AxiosResponse } from "axios"
import Logger from "../../../Logger"
import Application from "../../../Application"
import BaseFKartResponse from "../../../interfaces/FKart/BaseFKartResponse"
import Captcha from "../../../interfaces/FKart/Captcha"
import { useContext } from "react"
import { FKartContext } from "../../../contexts/FKartContext"

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
