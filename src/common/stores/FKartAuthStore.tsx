import ApplicationConfig from "common/ApplicationConfig"
import BaseFKartResponse from "common/interfaces/FKart/BaseFKartResponse"
import FKartUser from "common/interfaces/FKart/FKartUser"
import Logger from "common/Logger"
import { create } from "zustand"
interface FKartAuthStore {
	user: FKartUser | undefined
	__initF: () => void
	__init: boolean
	clear2FA: () => void
	fetchAccessToken: () => Promise<[false, string | undefined] | [string]>
	credentials: { access_token?: string; refresh_token?: string }
	twoFA?: { session_id: string; code?: string }
	login: (args: { username: string; password: string; twoFA_code?: string }) => Promise<[FKartUser] | [false, string | undefined]>
	register: (args: {}) => Promise<void>
	logout: () => Promise<[true] | [false, string | undefined]>
}
export const useFKartAuthStore = create<FKartAuthStore>((set, get) => ({
	__init: false,
	fetchAccessToken: async () => {
		const refresh_token = get().credentials?.refresh_token
		if (!refresh_token) return [false, "no refresh_token"]
		const url = `${ApplicationConfig.fkart_endpoints.auth}/user/access`
		console.log("access", refresh_token)
		const request = await fetch(url, {
			method: "POST",
			body: JSON.stringify({
				refresh_token: refresh_token,
			}),
		})
		let response:
			| (BaseFKartResponse & {
					session?: {
						user: FKartUser
						access_token: string
					}
			  })
			| undefined

		try {
			response = await request.json()
		} catch {
			response = undefined
		}
		console.log(response)
		if (!response) return [false, "Server returned invalid data!"]
		if (!response?.result.success || !response.session || !response.session.user || !response.session.access_token) {
			// 2FA Fail
			get().logout()
			return [false, response?.result.error as string]
		}
		const access_token = response.session.access_token
		Logger.info("FetchAccessToken", access_token)
		set({ credentials: { refresh_token: refresh_token, access_token: access_token }, user: response.session.user })
		return [access_token]
	},
	clear2FA: () => {
		set({ twoFA: undefined })
	},
	user: undefined,
	credentials: {
		access_token: undefined,
		refresh_token: undefined,
	},

	__initF: async () => {
		if (get().__init) {
			return
		}
		set({ __init: true })
		Logger.info("FKartAuthStore.__initF", "INIT")
		const db = ApplicationConfig.database
		const refresh_token = (await db.get("fkart.refresh_token")) as string
		Logger.info("FKartAuthStore.__initF", `refresh_token: ${refresh_token.slice(0, 10)}`)
		set({ credentials: { access_token: undefined, refresh_token: refresh_token } })

		const cycle = setInterval(async () => {
			/*
			APPARENTLY THIS WAS A TERRIBLE IDEA

			1139/1000 writes to KV
			1.4k Requests to auth service in the last hour


			{
				"result": {
					"cmd": "/user/access",
					"error": "Internal Server Error: Error: KV put() limit exceeded for the day.",
					"fTime": "6/30/2024, 4:26:15 PM",
					"status": 500,
					"success": false,
					"time": 1719764775689
				}
			}
			
			oops.
			 */
			console.log("fetch access token")
			await get().fetchAccessToken()
		}, 5_000)
		// if (!access_token) return
	},
	login: async (args) => {
		const { password, username, twoFA_code } = args
		const session = get().twoFA?.session_id
		console.log(`Attempting to login ${username} ${password.slice(0, 3)}...`)
		const url = `${ApplicationConfig.fkart_endpoints.auth}/user/get`
		const request = await fetch(url, {
			method: "POST",
			body: JSON.stringify({
				twoFA_session_id: session || undefined,
				twoFA_code: twoFA_code?.slice(0, 6) || undefined,
				email: username,
				password: password,
			}),
		})
		let response:
			| (BaseFKartResponse & {
					session?: { user: FKartUser; refresh_token: string; is_2fa_enabled: boolean }
					twoFA_session_id?: string
			  })
			| undefined

		try {
			response = await request.json()
		} catch {
			response = undefined
		}
		if (!response) return [false, "Server returned invalid data!"]
		if (!response?.result.success) {
			// 2FA Fail
			if (["This code has been used before!", "This session has been expired or not valid"].includes(response?.result?.error as string)) {
				set({ twoFA: undefined })
			}
			return [false, response?.result.error]
		}
		if (response.session && response.session.refresh_token && response.session.user) {
			// success
			set({
				credentials: { refresh_token: response.session.refresh_token, access_token: undefined },
				user: response.session.user,
				twoFA: undefined,
			})
			await ApplicationConfig.database.set("fkart.refresh_token", response.session.refresh_token)
			return [response.session.user]
		}
		if (response.twoFA_session_id) {
			// ask user for 2FA code
			set({
				twoFA: { session_id: response.twoFA_session_id },
			})
			return [false, "2FA Required!"]
		}
		return [false, "unknown error"]
	},
	register: async () => {
		// TODO: requires a proper captcha, can wait until then
	},
	logout: async () => {
		const { user, credentials, twoFA } = get()
		Logger.info(`Logging out from account ${user?.email}`)
		const url = `${ApplicationConfig.fkart_endpoints.auth}/user/logout`
		const request = await fetch(url, {
			method: "POST",
			body: JSON.stringify({
				refresh_token: credentials.refresh_token,
			}),
		})
		let response
		try {
			response = await request.json()
		} catch {
			response = undefined
		}
		if (!response) return [false, "Server returned invalid data!"]
		if (!response?.result.success) {
			return [false, response?.result.error]
		}
		console.log(response)
		set({ user: undefined, credentials: undefined })
		return [true]
	},
}))
