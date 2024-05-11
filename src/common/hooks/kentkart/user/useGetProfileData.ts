import { AxiosResponse } from "axios"
import Application from "common/Application"
import User from "common/classes/User"
import { useQueries, useQuery } from "react-query"
import { Account } from "common/interfaces/KentKart/Account"
import Logger from "common/Logger"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import { useContext } from "react"
import { UserContext } from "common/contexts/UserContext"

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
