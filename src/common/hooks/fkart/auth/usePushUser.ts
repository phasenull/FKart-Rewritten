import { useQuery } from "react-query"
import axios, { AxiosResponse } from "axios"
import BaseFKartResponse from "../../../interfaces/FKart/BaseFKartResponse"
import Logger from "../../../Logger"
import Application from "../../../Application"
import FKartUser from "../../../interfaces/FKart/FKartUser"

async function postUser(credentials?: { password?: string; username?: string},captcha_token?: string ): Promise<
	AxiosResponse<
		BaseFKartResponse & {
			user: FKartUser
		}
	>
> {
	Logger.info("REQUEST templateHook")
	return axios(`${Application.fkart_endpoints.auth}/user/push`, {
		method: "POST",
		data: JSON.stringify({
			email: credentials?.username,
			password: credentials?.password,
			captcha_token:captcha_token,
		}),
	})
}

export default function usePushUser(credentials?: { password?: string; username?: string }, captcha_token?: string) {
	return useQuery(["pushUser"], () => postUser(credentials,captcha_token), { enabled: false, retry: false })
}
