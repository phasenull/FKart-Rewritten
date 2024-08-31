import { useQuery } from "react-query"
import ApplicationConfig from "common/ApplicationConfig"
import API from "common/API"
import { AxiosResponse } from "axios"
import { FavoritesV3Card, Favorites } from "common/interfaces/KentKart/Favorite"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import Logger from "common/Logger"
import { useContext } from "react"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"

export default function useGetFavorites() {
	const credentials = useKentKartAuthStore((state)=>state.credentials)
	const region = useKentKartAuthStore((state)=>state.region)
	return useQuery(
		["getFavorites",credentials,region],
		async (): Promise<AxiosResponse<{cardlist:FavoritesV3Card[]} & BaseKentKartResponse> | undefined> => {
			const url = `${ApplicationConfig.endpoints.service}/rl1/api/v3.0/favorite?authType=4&region=${region}&token=${credentials.access_token}`
			Logger.info("REQUEST useGetFavorites")
			return ApplicationConfig.makeKentKartRequest(url)
		},
		{ staleTime:1*60*1000 }
	)
}
