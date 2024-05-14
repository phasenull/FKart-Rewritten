import { useQuery } from "react-query"
import axios, { AxiosResponse } from "axios"
import BaseFKartResponse from "common/interfaces/FKart/BaseFKartResponse"
import Logger from "common/Logger"
import Application from "common/Application"
import FKartUser from "common/interfaces/FKart/FKartUser"
import ICredentials from "common/interfaces/app/Credentials"
import { ToastAndroid } from "react-native"

async function getUser(credentials?: ICredentials): Promise<
	| AxiosResponse<
			| BaseFKartResponse & {
					session?: { user: FKartUser; refresh_token: string; is_2fa_enabled: boolean }
					twoFA_session_id?: string
			  }
	  >
	| undefined
> {
	Logger.info("REQUEST getUser")
	return axios(`${Application.fkart_endpoints.auth}/user/get`, {
		headers:{
			"User-Agent":Application.getFormattedVersion()
		},
		method: "POST",
		data: JSON.stringify({
			email: credentials?.username,
			password: credentials?.password,
			twoFA_session_id: credentials?.twoFA_session,
			twoFA_code: credentials?.twoFA_code,
		}),
	})
}

export default function useGetUser(credentials?: ICredentials) {
	return useQuery(["pushUser"], () => getUser(credentials), {
		enabled: false,
		retry: false,
		useErrorBoundary: false,
		onError: (e: any) => {
			// ToastAndroid.show(`error ${e?.response?.data?.result?.error}`,1000)
		},
	})
}
