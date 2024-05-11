import { useQuery } from "react-query"
import axios, { AxiosResponse } from "axios"
import BaseFKartResponse from "common/interfaces/FKart/BaseFKartResponse"
import Logger from "common/Logger"
import Application from "common/Application"
import FKartUser from "common/interfaces/FKart/FKartUser"
import ICredentials from "common/interfaces/app/Credentials"

async function postUser(credentials?: ICredentials,captcha_token?: string ): Promise<
	AxiosResponse<
		BaseFKartResponse & {
			user: FKartUser
		}
	>
> {
	Logger.info("REQUEST pushUser")
	return axios(`${Application.fkart_endpoints.auth}/user/push`, {
		method: "POST",
		data: JSON.stringify({
			email: credentials?.username,
			password: credentials?.password,
			captcha_token:captcha_token,
		}),
	})
}

export default function usePushUser(credentials?: ICredentials, captcha_token?: string) {
	return useQuery(["pushUser"], () => postUser(credentials,captcha_token), { enabled: false, retry: false })
}
