import { useQuery } from "react-query"
import ApplicationConfig from "common/ApplicationConfig"
import API from "common/API"
import { AxiosResponse } from "axios"
import { Favorites } from "common/interfaces/KentKart/Favorite"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import Logger from "common/Logger"
import { useContext } from "react"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"

export default function useGetFavorites() {
	const { user,region } = useKentKartAuthStore((state) => state) as {user:IKentKartUser,region:string}
	return useQuery(
		["getFavorites"],
		(): Promise<AxiosResponse<Favorites & BaseKentKartResponse> | undefined> => {
			const url = `${ApplicationConfig.endpoints.service}/rl1/api/v4.0/favorite?authType=4&region=${region}&token=${user.access_token}`
			Logger.info("REQUEST useGetFavorites")
			return ApplicationConfig.makeKentKartRequest(url)
		},
		{ refetchInterval: 30_000 }
	)
}
