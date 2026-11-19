import API from "common/API"
import ApplicationConfig from "common/ApplicationConfig"
import AuthTypes from "common/enums/LoginTypes"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import Logger from "common/Logger"
import { createWithEqualityFn } from "zustand/traditional"
import { createJSONStorage, persist, StateStorage } from "zustand/middleware"

type Result = [true] | [false, string]
interface KentKartAuthStore {
	user: undefined | IKentKartUser
	region: string | undefined
	auth_type: string
	fetchAccessToken: (refresh_token?: string, isOTP?: boolean) => Promise<[false, string | undefined] | [string]>
	fetchAccountInfo: () => Promise<[false, string] | [IKentKartUser]>
	credentials: { access_token?: string; refresh_token?: string }
	/** phone / e-mail + password */
	login: (args: { username: string; password: string; auth_type: AuthTypes }) => Promise<Result>
	/** sends an SMS / e-mail code, resolves to the reference number */
	sendOtp: (args: { username: string; auth_type: AuthTypes }) => Promise<[string] | [false, string]>
	/** signs in (and registers, if the account doesn't exist yet) with the code from sendOtp */
	loginWithOtp: (args: { username: string; auth_type: AuthTypes; otp_code: string; ref_no: string }) => Promise<Result>
	/** name, surname and an optional new password for the signed in account */
	updateProfile: (args: { name: string; surname: string; password?: string }) => Promise<Result>
	setRegion: (region: string) => void
	logout: () => void
}

const storage: StateStorage = {
	getItem: async (name: string): Promise<string | null> => {
		const data = (await ApplicationConfig.database.get(`zustand.kentkart.${name}`)) || null
		return data
	},
	setItem: async (name: string, value: string): Promise<void> => {
		await ApplicationConfig.database.set(`zustand.kentkart.${name}`, value)
	},
	removeItem: async (name: string): Promise<void> => {
		await ApplicationConfig.database.removeItem(`zustand.kentkart.${name}`)
	},
}
export const useKentKartAuthStore = createWithEqualityFn<KentKartAuthStore>()(
	persist(
		(set, get) => {
			const authRegion = () => get().region || ApplicationConfig.region
			/** auth code -> tokens -> account info */
			async function finishLogin(one_time_code: string): Promise<Result> {
				await ApplicationConfig.database.set("kentkart.one_time_code", one_time_code)
				const [access_token, access_token_error] = await get().fetchAccessToken(one_time_code, true)
				if (!access_token) return [false, access_token_error || "Could not get an access token"]
				const [user, user_error] = await get().fetchAccountInfo()
				if (!user) Logger.warning("KentKartAuthStore.finishLogin", user_error)
				return [true]
			}
			return {
				user: undefined,
				region: undefined,
				auth_type: "4",
				credentials: {
					access_token: undefined,
					refresh_token: undefined,
				},
				setRegion: async (region: string) => {
					set({ region: region })
					const db = ApplicationConfig.database
					await db.set("kentkart.region", region)
				},
				login: async (args) => {
					const { auth_type, password, username } = args
					console.log(`Attempting to login ${username} ${AuthTypes[auth_type]}`)
					const [one_time_code, error] = await API.authorize({ auth_type, password, username, region: authRegion() })
					if (!one_time_code) {
						Logger.error("KentKartAuthStore.login", error)
						return [false, error as string]
					}
					return finishLogin(one_time_code)
				},
				sendOtp: async (args) => {
					const [ref_no, error] = await API.sendOtp({ ...args, region: authRegion() })
					if (!ref_no) Logger.error("KentKartAuthStore.sendOtp", error)
					return ref_no ? [ref_no] : [false, error as string]
				},
				loginWithOtp: async (args) => {
					const { auth_type, username, otp_code, ref_no } = args
					const [one_time_code, error] = await API.authorize({ auth_type, username, otp_code, ref_no, region: authRegion() })
					if (!one_time_code) {
						Logger.error("KentKartAuthStore.loginWithOtp", error)
						return [false, error as string]
					}
					return finishLogin(one_time_code)
				},
				updateProfile: async (args) => {
					const access_token = get().credentials.access_token
					if (!access_token) return [false, "not logged in"]
					const result = await API.updateProfile({ ...args, access_token, region: authRegion() })
					if (result[0]) await get().fetchAccountInfo()
					return result
				},
				fetchAccessToken: async (refresh_token?: string, isOTP?: boolean) => {
					if (!refresh_token) {
						refresh_token = get().credentials.refresh_token
						if (!refresh_token) return [false, "not logged in"]
					}
					const [tokenData, access_token_error] = await API.getAccessToken({
						token: refresh_token,
						token_type: isOTP ? "OTP" : "refresh",
						region: authRegion(),
					})
					if (!tokenData) {
						console.log("access_token_error", access_token_error)
						set({ credentials: {}, user: undefined })
						return [false, access_token_error]
					}
					const { access_token, refresh_token: new_refresh_token } = tokenData
					set({ credentials: { access_token: access_token, refresh_token: new_refresh_token || refresh_token } })
					return [access_token]
				},
				fetchAccountInfo: async () => {
					const { credentials, auth_type } = get()
					const { access_token } = credentials
					if (!access_token) return [false, "access token not found, please log in"]
					const [data, error] = await API.fetchProfile({ access_token: access_token, auth_type: auth_type, region: authRegion() })
					if (!data) {
						Logger.error("KentKartAuthStore.tsx.fetchAccountInfo", error)
						return [false, error as string]
					}
					set({ user: data })
					Logger.info("KentKartAuthStore.tsx.fetchAccountInfo", "account info fetch successfull")
					return [data]
				},
				logout: () => {
					Logger.info("KentKartAuthStore.tsx.logout", `Logging out from account ${get().user?.name}`)
					set({ user: undefined, credentials: { access_token: undefined, refresh_token: undefined } })
				},
			}
		},
		{
			name: "kentkart-storage", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => storage), // (optional) by default, 'localStorage' is used
		}
	)
)
