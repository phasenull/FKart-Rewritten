import { useQuery } from "react-query"
import User from "../classes/User"
import Application from "../Application"
import API from "../API"
import { AxiosResponse } from "axios"
import { Favorites } from "../enums/Favorites"
import { BaseKentKartResponse } from "../enums/BasicKentKartResponse"

async function getFavorites(): Promise<
	AxiosResponse<Favorites & BaseKentKartResponse>
> {
	const user = Application.logged_user
	const url = `${Application.endpoints.service}/rl1/api/v4.0/favorite?authType=4&region=${Application.region}`

	if (!user) {
		throw new Error("User not logged in.")
	}
	return Application.makeRequest(url, {
		method: "GET",
	})
}

export default function useGetFavorites() {
	return useQuery([], getFavorites,{refetchInterval: 10000,staleTime:0})
}
