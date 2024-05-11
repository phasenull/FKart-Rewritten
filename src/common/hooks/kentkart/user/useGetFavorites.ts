import { useQuery } from "react-query"
import User from "common/classes/User"
import Application from "common/Application"
import API from "common/API"
import { AxiosResponse } from "axios"
import { Favorites } from "common/interfaces/KentKart/Favorite"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import Logger from "common/Logger"
import { UserContext } from "common/contexts/UserContext"
import { useContext } from "react"

async function getFavorites(user?:User): Promise<
	AxiosResponse<Favorites & BaseKentKartResponse> | undefined
> {
	const url = `${Application.endpoints.service}/rl1/api/v4.0/favorite?authType=4&region=${Application.region}`

	Logger.info("REQUEST useGetFavorites")
	if (!user) {
		return undefined
	}
	return Application.makeKentKartRequest(url)
}

export default function useGetFavorites() {
	
	const {loggedUser:user} = useContext(UserContext)
	return useQuery(["getFavorites"], ()=>getFavorites(user),{refetchInterval: 30_000,cacheTime:0.5*60*60*1000})
}
