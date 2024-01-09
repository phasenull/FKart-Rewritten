import { AxiosResponse } from "axios"
import Application from "../Application"
import User from "../classes/User"
import { useQueries, useQuery } from "react-query"

async function getProfile({ user }: { user: User }) {
	const url = `${Application.endpoints.service}/rl1/api/account?region=${Application.region}&authType=4`
	const request: Promise<
		AxiosResponse<{
			data: {
				result: { code: number; message?: string }
				accountInfo: any
			}
			status: number
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
	const user = Application.logged_user
	if (!user) {
		throw new Error("User not logged in.")
	}
	const {
		data,
		error,
		isLoading,
		refetch,
		isError,
		isRefetching,
	} = useQuery(
		["getProfile", user],
		() => getProfile({ user })
	)
	return {
		data,
		error,
		isLoading,
		isError,
		refetch,
		isRefetching,
	}
}
