import { useQuery } from "react-query"
import ApplicationConfig from "common/ApplicationConfig"
import API from "common/API"
import { AxiosResponse } from "axios"
import { Favorites } from "common/interfaces/KentKart/Favorite"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import Logger from "common/Logger"
import { useContext } from "react"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"

async function getFavorites(token?:string): Promise<
	AxiosResponse<Favorites & BaseKentKartResponse> | undefined
> {
	const url = `${ApplicationConfig.endpoints.service}/rl1/api/v4.0/favorite?authType=4&region=${ApplicationConfig.region}`

	Logger.info("REQUEST useGetFavorites")
	if (!token) return
	return ApplicationConfig.makeKentKartRequest(url)
}

export default function useGetFavorites() {
	
	const {credentials} = useKentKartAuthStore((state)=>state)
	return useQuery(["getFavorites"], ()=>getFavorites(credentials.access_token),{refetchInterval: 30_000})
}
