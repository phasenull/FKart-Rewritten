import LoginTypes from "./enums/LoginTypes"
import Application from "./Application"
import Logger from "./Logger"
import User from "./classes/User"
import { useQuery } from "react-query"
import { AxiosResponse } from "axios"

export default abstract class API {
	public static async getRefreshToken({
		auth_type,
		auth_value,
		password,
	}: {
		auth_type: LoginTypes
		auth_value: string
		password: string
	}) {
		if (!auth_value || !password) {
			Logger.warning(
				"User.login",
				"auth_value or password is empty!"
			)
			throw new Error("auth_value or password is empty!")
		}
		const region = Application.region
		if (!region) {
			Logger.warning("User.login", "Region is empty!")
			throw new Error("Region is empty!")
		}
		const body = {
			clientId: "rH7S2",
			countryCode: "tr",
			pin: `${password}`,
			loginType:
				auth_type === LoginTypes.email ? "email" : "phone",
			responseType: "code",
			[auth_type === LoginTypes.email ? "email" : "phoneNumber"]:
				auth_value,
		}
		const request = await Application.makeKentKartRequest(
			`${Application.endpoints.auth}/rl1/oauth/authorize?region=${region}&authType=4&lang=tr`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				params: body,
			}
		)
		console.log("API.getRefreshToken",request.status, request.data)
		if (!(request.status === 200)) {
			throw new Error(
				"Access token failed! (status code not 200)"
			)
		}
		if (request.data?.result?.code !== 0) {
			if (request.data?.result?.message) {
				throw new Error(`${request.data?.result.message}`)
			}
			throw new Error("Access token failed!", {
				cause: request.data?.result?.extraErrorMessage,
			})
		}
		const one_time_code = request.data?.code
		if (!one_time_code)
			throw new Error(
				"Access token failed! (one_time_code is empty)"
			)
		return one_time_code
	}
	public static async fetchCardData({
		region,
		alias,
		token,
	}: {
		region: string
		alias: string
		token: string
	}) {
		const url = `${Application.endpoints.service}/rl1/api/card/balance?region=${region}&lang=tr&authType=4&token=${token}&alias=${alias}`
		return Application.makeKentKartRequest(url)
	}
	public static async getAuthToken({
		refresh_token,
	}: {
		refresh_token: string
	}): Promise<string|null> {
		const request = await Application.makeKentKartRequest(
			`${Application.endpoints.auth}/rl1/oauth/token`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				data: {
					loginType: "phone",
					clientId: "rH7S2", // no idea what this is i hope i dont get hacked (amen)
					clientSecret: "Om121T12fSv1j66kp9Un5vE9IMkJ3639", // static client secret (Gandalf didnt tell me to keep it secret so i didnt)
					code: refresh_token,
					grantType: "authorizationCode",
					redirectUri: "m.kentkart.com",
				},
			}
		)
		if (request.status !== 200) {
			Logger.warning(`Get Token failed! (status code not 200)`)
			return null
		}
		if (request.data?.result?.code !== 0) {
			Logger.warning(`Get Token failed. \n${JSON.stringify(request.data?.result,undefined,4)}`)
			return null
		}
		return request.data.accessToken
	}
	public static async getProfile({ user }: { user: User }) {
		const url = `${Application.endpoints.service}/rl1/api/account?region=${Application.region}&authType=4`
		const request: {
			data: {
				result: { code: number; message?: string }
				accountInfo: any
			}
			status: number
		} = await Application.makeKentKartRequest(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${user.access_token}`,
			},
		})
		if (request.status !== 200) {
			throw new Error("Get Profile failed! (status code not 200)")
		}
		if (request.data?.result.code === 33) {
			Application.userAuthCookieTimedOut()
			return false
		}
		if (request.data?.result.code !== 0) {
			throw new Error(
				`Get Profile failed. (Response Code: ${request.data.result?.code} / ${request.data.result?.message})`
			)
		}
		return request.data.accountInfo
	}
	public static handleDefaultResult(result: any) {
		if (result.status !== 200) {
			throw new Error(
				"Get Favorites failed! (status code not 200)"
			)
		}
		const response = result.data
		// auth token expired
		if (response.result.code === 33) {
			Application.userAuthCookieTimedOut()
			return false
		}
		if (response.result.code !== 0) {
			throw new Error("Get Favorites failed.")
		}
		return response
	}
	// public static async getFavorites({ user }: { user: User }) {
	// 	const url = `${Application.endpoints.service}/rl1/api/v4.0/favorite?authType=4&region=${Application.region}`
	// 	const result = await Application.makeRequest(url, {
	// 		method: "GET",
	// 		headers: {
	// 			Authorization: `Bearer ${user.access_token}`,
	// 		},
	// 	})

	// 	return API.handleDefaultResult(result)?.userFavorites
	// }
}
