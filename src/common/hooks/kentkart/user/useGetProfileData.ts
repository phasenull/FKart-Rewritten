import { AxiosResponse } from "axios"
import Application from "../../../Application"
import User from "../../../classes/User"
import { useQueries, useQuery } from "react-query"
import { Account } from "../../../interfaces/KentKart/object/Account"
import Logger from "../../../Logger"
import { BaseKentKartResponse } from "../../../interfaces/KentKart/BasicKentKartResponse"
import { useContext } from "react"
import { UserContext } from "../../../contexts/UserContext"

async function getProfile(user?: User): Promise<AxiosResponse<BaseKentKartResponse & { accountInfo: Account }>> {
	Logger.info("REQUEST useGetProfileData")
	const url = `${Application.endpoints.service}/rl1/api/account?region=${Application.region}&authType=4`
	const request = Application.makeKentKartRequest(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${user?.access_token}`,
		},
	})
	return request
}
export default function useGetProfileData() {
	const {loggedUser:user} = useContext(UserContext)
	return useQuery(["useGetProfileData"], () => getProfile(user))
}
