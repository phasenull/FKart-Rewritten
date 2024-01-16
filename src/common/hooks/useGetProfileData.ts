import { AxiosResponse } from "axios"
import Application from "../Application"
import User from "../classes/User"
import { useQueries, useQuery } from "react-query"
import { Account } from "../enums/Account"

async function getProfile() {
	const user = Application.logged_user
	if (!user) {
		throw new Error("User not logged in.")
	}
	const url = `${Application.endpoints.service}/rl1/api/account?region=${Application.region}&authType=4`
	const request: Promise<
		AxiosResponse<{
			result: { code: number; message?: string }
			accountInfo: Account
		}>
	> = Application.makeRequest(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${user.access_token}`,
		},
	})
	return request
}
export default function useGetProfileData() {
	return useQuery(["useGetProfileData"],getProfile)
}
