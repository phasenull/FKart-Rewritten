import LoginTypes from "./enums/LoginTypes"
import Application from "./Application"
import Logger from "./Logger"
import User from "./classes/User"

export default abstract class API {
	public static async getRefreshToken({ auth_type, auth_value, password }: { auth_type: LoginTypes; auth_value: string; password: string }) {
		if (!auth_value || !password) {
			Logger.warning("User.login", "auth_value or password is empty!")
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
			loginType: auth_type === LoginTypes.email ? "email" : "phone",
			responseType: "code",
			[auth_type === LoginTypes.email ? "email" : "phoneNumber"]: auth_value,
		}
		const result = await Application.fetch(
			`https://auth.kentkart.com/rl1/oauth/authorize?region=${region}&authType=4&lang=tr`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			}
		)
		const response = await result.json()
		if (!(result.status === 200)) {
			throw new Error("Access token failed! (status code not 200)")
		}
		if (response.result?.code !== 0) {
			if (response.result?.message) {
				throw new Error(`${response.result.message}`)
			}
			throw new Error("Access token failed!", { cause: response.result?.extraErrorMessage })
		}
		const one_time_code = response.code
		if (!one_time_code) throw new Error("Access token failed! (one_time_code is empty)")
		return one_time_code
	}
	public static async getAuthToken({ refresh_token }: { refresh_token: string }) {
		const result = await Application.fetch(`https://auth.kentkart.com/rl1/oauth/token?`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				loginType: "phone",
				clientId: "rH7S2", // no idea what this is i hope i dont get hacked (amen)
				clientSecret: "Om121T12fSv1j66kp9Un5vE9IMkJ3639", // static client secret (Gandalf didnt tell me to keep it secret so i didnt)
				code: refresh_token,
				grantType: "authorizationCode",
				redirectUri: "m.kentkart.com",
			}),
		})
		const response2 = await result.json()
		if (result.status !== 200) {
			throw new Error("Get Token failed! (status code not 200)")
		}
		if (response2.result.code !== 0) {
			throw new Error("Get Token failed.")
		}
		return response2.accessToken
	}
	public static async getProfile({ user }: { user: User }) {
		const url = `https://service.kentkart.com/rl1/api/account?region=${Application.region}&authType=4`
		const result = await Application.fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${user.access_token}`,
			},
		})
		const response = await result.json()
		if (result.status !== 200) {
			throw new Error("Get Profile failed! (status code not 200)")
		}
		if (response.result.code !== 0) {
			throw new Error("Get Profile failed.")
		}
		return response.accountInfo
	}
	public static async getFavorites({ user }: { user: User }) {
		const url = `https://service.kentkart.com/rl1/api/v4.0/favorite?authType=4&region=${Application.region}`
		const result = await Application.fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${user.access_token}`,
			},
		})
		if (result.status !== 200) {
			throw new Error("Get Favorites failed! (status code not 200)")
		}
		const response = await result.json()
		if (response.result.code !== 0) {
			throw new Error("Get Favorites failed.")
		}
		return response?.userFavorites
	}
}
