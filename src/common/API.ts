import AuthTypes from "./enums/LoginTypes"
import ApplicationConfig from "./ApplicationConfig"
import Logger from "./Logger"
import { IKentKartUser } from "./interfaces/KentKart/KentKartUser"

export default abstract class API {
	public static async getOneTimeCode({ auth_type, username, password }: { auth_type: AuthTypes; username: string; password: string }): Promise<[string] | [false, string]> {
		if (!username || !password) {
			Logger.warning("User.login", "username or password is empty!")
			return [false, "username or password is empty!"]
		}
		const region = ApplicationConfig.region
		if (!region) {
			Logger.warning("User.login", "Region is empty!")
			return [false, "Region is empty!"]
		}
		const body = {
			clientId: "rH7S2",
			countryCode: "tr",
			pin: `${password}`,
			loginType: auth_type === AuthTypes.email ? "email" : "phone",
			responseType: "code",
			[auth_type === AuthTypes.email ? "email" : "phoneNumber"]: username,
		}
		const request = await ApplicationConfig.makeKentKartRequest(`${ApplicationConfig.endpoints.auth}/rl1/oauth/authorize?region=${region}&authType=4&lang=tr`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			params: body,
		})
		console.log("API.getOneTimeCode", request.status, request.data)
		if (!(request.status === 200)) {
			return [false, "Access token failed! (status code not 200)"]
		}
		if (request.data?.result?.code !== 0) {
			if (request.data?.result?.message) {
				return [false, `${request.data?.result.message}`]
			}
			return [false, `Access token failed! ${request.data?.result?.extraErrorMessage}`]
		}
		const one_time_code = request.data?.code
		if (!one_time_code) return [false, "Access token failed! (one_time_code is empty)"]
		return [one_time_code]
	}
	public static async getAccessToken({ refresh_token }: { refresh_token: string }): Promise<[string] | [false, string]> {
		const request = await ApplicationConfig.makeKentKartRequest(`${ApplicationConfig.endpoints.auth}/rl1/oauth/token`, {
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
		})
		if (request.status !== 200) {
			Logger.warning(`Get Token failed! (status code not 200)`)
			return [false, `Get Token failed! (status code not 200)`]
		}
		if (request.data?.result?.code !== 0) {
			Logger.warning(`Get Token failed. \n${JSON.stringify(request.data?.result, undefined, 4)}`)
			return [false, JSON.stringify(request.data?.result, undefined, 4)]
		}
		return [request.data.accessToken]
	}
	public static async fetchProfile({ access_token, region, auth_type }: { access_token: string; region: string; auth_type: string }): Promise<[IKentKartUser] | [false, string]> {
		const url = `${ApplicationConfig.endpoints.service}/rl1/api/account?region=${ApplicationConfig.region}&authType=4&token=${access_token}`
		const request: {
			data: {
				result: { code: number; message?: string }
				accountInfo: any
			}
			status: number
		} = await ApplicationConfig.makeKentKartRequest(url, {
			method: "GET",
			headers: {
				// Authorization: `Bearer ${access_token}`,
			},
		})
		if (request.status !== 200) {
			return [false, "Get Profile failed! (status code not 200)"]
		}
		if (request.data?.result.code === 33) {
			return [false, `error 33, session timed out token:${access_token}`]
		}
		if (request.data?.result.code !== 0) {
			return [false, `Get Profile failed. (Response Code: ${request.data.result?.code} / ${request.data.result?.message})`]
		}
		return [request.data.accountInfo]
	}
}
