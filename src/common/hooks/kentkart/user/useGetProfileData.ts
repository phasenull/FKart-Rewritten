import { AxiosResponse } from "axios"
import ApplicationConfig from "common/ApplicationConfig"
import { useQueries, useQuery } from "react-query"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import Logger from "common/Logger"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import { useContext } from "react"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"

async function getProfile(token:string): Promise<AxiosResponse<BaseKentKartResponse & { accountInfo: IKentKartUser }>> {
	Logger.info("REQUEST useGetProfileData")
	const url = `${ApplicationConfig.endpoints.service}/rl1/api/account?region=${ApplicationConfig.region}&authType=4`
	const request = ApplicationConfig.makeKentKartRequest(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return request
}
export default function useGetProfileData() {
	const {credentials} = useKentKartAuthStore((state)=>state)
	return useQuery(["useGetProfileData"], () => getProfile(credentials.access_token as string))
}
