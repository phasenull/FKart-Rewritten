import AuthTypes from "./enums/LoginTypes"
import ApplicationConfig from "./ApplicationConfig"
import Logger from "./Logger"
import { IKentKartUser } from "./interfaces/KentKart/KentKartUser"

// Same client m.kentkart.com uses (see its bundled config: apiServer.clientId / clientRef / redirectUri)
const CLIENT_ID = "rH7S2"
const CLIENT_SECRET = "Om121T12fSv1j66kp9Un5vE9IMkJ3639"
const REDIRECT_URI = "m.kentkart.com"

type KKResult = { code?: number | string; message?: string; extraErrorMessage?: string }

/** Turkish mobile numbers: KentKart wants the 10 digits after +90 (5XXXXXXXXX). */
export function normalizePhone(input: string) {
	let digits = (input || "").replace(/\D/g, "")
	if (digits.length === 12 && digits.startsWith("90")) digits = digits.slice(2)
	if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1)
	return digits
}

function authQuery(region: string) {
	return new URLSearchParams({ region: region, authType: "4", lang: "tr" }).toString()
}

function resultError(result: KKResult | undefined, fallback: string) {
	if (result?.message) return `${result.message}`
	if (result?.extraErrorMessage) return `${fallback} ${result.extraErrorMessage}`
	return `${fallback}${result?.code !== undefined ? ` (code ${result.code})` : ""}`
}

function isOk(result: KKResult | undefined) {
	return result?.code !== undefined && Number(result.code) === 0
}

function identity(auth_type: AuthTypes, username: string): Record<string, string> {
	if (auth_type === AuthTypes.email) {
		return { loginType: "email", email: username.trim(), countryCode: "tr" }
	}
	return { loginType: "phone", phoneNumber: normalizePhone(username), countryCode: "tr" }
}

export default abstract class API {
	/**
	 * POST /oauth/authorize with a JSON body (the old query-string form is rejected with code 411).
	 * Either `password` (pin) or `otp_code` + `ref_no` must be given. Returns the one-time auth code.
	 */
	public static async authorize(args: {
		auth_type: AuthTypes
		username: string
		region: string
		password?: string
		otp_code?: string
		ref_no?: string
	}): Promise<[string] | [false, string]> {
		const { auth_type, username, region, password, otp_code, ref_no } = args
		if (!username) return [false, "Phone number / e-mail is empty!"]
		if (!password && !(otp_code && ref_no)) return [false, "Password is empty!"]
		if (!region) return [false, "Region is empty!"]
		const body: Record<string, string> = {
			clientId: CLIENT_ID,
			responseType: "code",
			...identity(auth_type, username),
		}
		if (password) body.pin = `${password}`
		else {
			body.otpCode = `${otp_code}`.trim()
			body.refNo = `${ref_no}`
		}
		try {
			const request = await ApplicationConfig.makeKentKartRequest(
				`${ApplicationConfig.endpoints.auth}/rl1/oauth/authorize?${authQuery(region)}`,
				{ method: "POST", headers: { "Content-Type": "application/json" }, data: body }
			)
			Logger.info("API.authorize", request.status, JSON.stringify(request.data?.result))
			if (request.status !== 200) return [false, `Sign in failed (HTTP ${request.status})`]
			if (!isOk(request.data?.result)) return [false, resultError(request.data?.result, "Sign in failed!")]
			const code = request.data?.code
			if (!code) return [false, "Sign in failed! (no code returned)"]
			return [code]
		} catch (e: any) {
			return [false, e?.response?.data?.result?.message || e?.message || "Network error"]
		}
	}

	/**
	 * POST /oauth/otp: sends a 5-digit code by SMS (or e-mail). Returns the reference number to verify it with.
	 * KentKart creates the account on first verification, so this is also the register / forgot password flow.
	 */
	public static async sendOtp(args: { auth_type: AuthTypes; username: string; region: string }): Promise<[string] | [false, string]> {
		const { auth_type, username, region } = args
		if (!username) return [false, "Phone number / e-mail is empty!"]
		const body = {
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			responseType: "code",
			smsDigest: "",
			...identity(auth_type, username),
		}
		try {
			const request = await ApplicationConfig.makeKentKartRequest(
				`${ApplicationConfig.endpoints.auth}/rl1/oauth/otp?${authQuery(region)}`,
				{ method: "POST", headers: { "Content-Type": "application/json" }, data: body }
			)
			Logger.info("API.sendOtp", request.status, JSON.stringify(request.data?.result))
			if (request.status !== 200) return [false, `Could not send the code (HTTP ${request.status})`]
			if (!isOk(request.data?.result)) return [false, resultError(request.data?.result, "Could not send the code!")]
			const ref_no = request.data?.refNo
			if (ref_no === undefined || ref_no === null || ref_no === "") return [false, "Could not send the code! (no reference number)"]
			return [String(ref_no)]
		} catch (e: any) {
			return [false, e?.response?.data?.result?.message || e?.message || "Network error"]
		}
	}

	public static async getAccessToken(args: { token: string; token_type: "OTP" | "refresh"; region?: string }): Promise<[{ access_token: string; refresh_token?: string }] | [false, string]> {
		const { token: token_or_code, token_type } = args
		const isOTP = !(token_type === "refresh")
		Logger.info("API.ts", "getAccessToken via", isOTP ? "OTP" : "refresh token")
		const data = {
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET, // (server is the client itself)
			code: isOTP ? token_or_code : undefined,
			refreshToken: !isOTP ? token_or_code : undefined,
			grantType: isOTP ? "authorizationCode" : "refreshToken",
			redirectUri: REDIRECT_URI, // for client rH7S2
		}
		try {
			const request = await ApplicationConfig.makeKentKartRequest(
				`${ApplicationConfig.endpoints.auth}/rl1/oauth/token?${authQuery(args.region || ApplicationConfig.region)}`,
				{ method: "POST", headers: { "Content-Type": "application/json" }, data: data }
			)
			if (request.status !== 200) {
				Logger.warning(`Get Token failed! (status code not 200)`)
				return [false, `Get Token failed! (status code not 200)`]
			}
			if (!isOk(request.data?.result)) {
				Logger.warning(`Get Token failed. \n${JSON.stringify(request.data?.result, undefined, 4)}`)
				return [false, resultError(request.data?.result, "Get Token failed!")]
			}
			return [{ access_token: request.data.accessToken, refresh_token: request.data.refreshToken }]
		} catch (e: any) {
			return [false, e?.response?.data?.result?.message || e?.message || "Network error"]
		}
	}

	/** PUT /api/v4.0/account: name, surname and (optionally) a new password, as m.kentkart's profile page does. */
	public static async updateProfile(args: {
		access_token: string
		region: string
		name: string
		surname: string
		password?: string
	}): Promise<[true] | [false, string]> {
		const { access_token, region, name, surname, password } = args
		const query = new URLSearchParams({ region: region, authType: "4", lang: "tr", name: name.trim(), surname: surname.trim() })
		if (password) query.set("pin", password)
		try {
			const request = await ApplicationConfig.makeKentKartRequest(
				`${ApplicationConfig.endpoints.service}/rl1/api/v4.0/account?${query.toString()}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json", Authorization: `Bearer ${access_token}` },
					data: { additional_info: "" },
				}
			)
			Logger.info("API.updateProfile", request.status, JSON.stringify(request.data?.result))
			if (request.status !== 200) return [false, `Could not save (HTTP ${request.status})`]
			if (!isOk(request.data?.result)) return [false, resultError(request.data?.result, "Could not save!")]
			return [true]
		} catch (e: any) {
			return [false, e?.response?.data?.result?.message || e?.message || "Network error"]
		}
	}

	public static async fetchProfile({ access_token, region, auth_type }: { access_token: string; region: string; auth_type: string }): Promise<[IKentKartUser] | [false, string]> {
		const url = `${ApplicationConfig.endpoints.service}/rl1/api/account?region=${region || ApplicationConfig.region}&authType=4&token=${access_token}`
		const request: {
			data: {
				result: { code: number; message?: string }
				accountInfo: any
			}
			status: number
		} = await ApplicationConfig.makeKentKartRequest(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${access_token}`,
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
