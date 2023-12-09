import LoginTypes from "../enums/LoginTypes"
import Application from "./Application"
import Logger from "./Logger"

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
		const result = await Application.fetch(`https://auth.kentkart.com/rl1/oauth/authorize?region=${region}&authType=4`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})
		const response = await result.json()
		if (!(response.status === 200)) {
			throw new Error("Auth failed! (status code not 200)")
		}
		if (response.result?.code !== 0) {
			if (response.result?.message) {
				throw new Error(`${response.result.message}`)
			}
			throw new Error("Auth failed!")
		}
		const one_time_code = response.code
		if (!one_time_code) throw new Error("Auth failed! (one_time_code is empty)")
		return one_time_code
	}
	public static async getAuthToken({ refresh_token }: { refresh_token: string }) {
		const result = await Application.fetch("https://auth.kentkart.com/rl1/oauth/token?region=004&authType=4", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				clientId: "rH7S2", // no idea what this is i hope i dont get hacked (amen)
				clientSecret: "Om121T12fSv1j66kp9Un5vE9IMkJ3639", // static client secret (Gandalf didnt tell me to keep it secret so i didnt)
				code: refresh_token,
				grantType: "authorizationCode",
				redirectUri: "m.kentkart.com",
			}),
		})
		const response2 = await result.json()
		if (response2.status !== 200) {
			throw new Error("Get Token failed! (status code not 200)")
		}
		if (response2.result.code !== 0) {
			throw new Error("Get Token failed.")
		}
		return response2.accessToken
	}
}
