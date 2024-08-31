import { AxiosResponse } from "axios"
import ApplicationConfig from "common/ApplicationConfig"
import { useQueries, useQuery } from "react-query"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import Logger from "common/Logger"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
export default function useGetProfileData() {
	const region = useKentKartAuthStore((state) => state.region)
	const credentials = useKentKartAuthStore((state) => state.credentials)
	return useQuery(
		["useGetProfileData", region, credentials.access_token],
		async (): Promise<AxiosResponse<BaseKentKartResponse & { accountInfo: IKentKartUser }>> => {
			Logger.info("REQUEST useGetProfileData")
			const [data, error] = await useKentKartAuthStore.getState().fetchAccountInfo()
			if (error) return{data:{}} as any
			return {
				data: {
					accountInfo: data,
				},
			} as any
		},
		{ staleTime: 3 * 60 * 1000 }
	)
}
