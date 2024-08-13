import { AxiosResponse } from "axios"
import ApplicationConfig from "common/ApplicationConfig"
import { useQueries, useQuery } from "react-query"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import Logger from "common/Logger"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
export default function useGetProfileData() {
	const {user,region} = useKentKartAuthStore((state) => state) as {user:IKentKartUser,region:string}
	return useQuery(["useGetProfileData"], (): Promise<AxiosResponse<BaseKentKartResponse & { accountInfo: IKentKartUser }>> => {
		Logger.info("REQUEST useGetProfileData")
		const url = `${ApplicationConfig.endpoints.service}/rl1/api/account?region=${region}&authType=4&token=${user.access_token}&anticache=${Math.random()}`
		const request = ApplicationConfig.makeKentKartRequest(url, {
			method: "GET",
		})
		return request
	},{staleTime:5*1000})
}
