import API from "common/API"
import ApplicationConfig from "common/ApplicationConfig"
import AuthTypes from "common/enums/LoginTypes"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import Logger from "common/Logger"
import { create } from "zustand"
import { createJSONStorage, persist, StateStorage } from "zustand/middleware"
interface KentKartAuthStore {
	user: undefined | IKentKartUser
	region: string | undefined
	auth_type: string
	fetchAccessToken: (refresh_token: string) => Promise<[false, string | undefined] | [string]>
	fetchAccountInfo: () => Promise<[false, string] | [IKentKartUser]>
	credentials: { access_token?: string; refresh_token?: string }
	login: (args: { username: string; password: string; auth_type: AuthTypes }) => Promise<[true] | [false, string | undefined]>
	register: (args: {}) => Promise<void>
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
export const useKentKartAuthStore = create<KentKartAuthStore>()(
	persist(
		(set, get) => ({
			user: undefined,
			region: undefined,
			auth_type: "04", //undefined,
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
				console.log(`Attempting to login ${username} ${password.slice(0, 3)}... ${auth_type}`)
				const [one_time_code, one_time_code_error] = await API.getOneTimeCode({
					auth_type,
					password,
					username,
				})
				// console.log("got refresh token", one_time_code)
				if (!one_time_code) {
					Logger.error("KentKartAuthStore.login", one_time_code_error)
					return [false, one_time_code_error]
				}
				await ApplicationConfig.database.set("kentkart.one_time_code", one_time_code)
				const [access_token, access_token_error] = await get().fetchAccessToken(one_time_code)
				console.log("login successfull", access_token)
				if (!access_token) {
					return [false, access_token_error]
				}
				return [true]
			},
			fetchAccessToken: async (refresh_token: string) => {
				const [access_token, access_token_error] = await API.getAccessToken({
					refresh_token: refresh_token,
				})
				// console.log("got access token", access_token)
				if (!access_token) {
					return [false, access_token_error]
				}
				set({ credentials: { access_token: access_token, refresh_token: refresh_token } })
				await get().fetchAccountInfo()
				return [access_token]
			},
			fetchAccountInfo: async () => {
				// console.log("fetching account info")
				const { credentials, auth_type, region } = get()
				const { access_token } = credentials
				if (!access_token) return [false, "access token not found, please log in"]
				const [data, error] = await API.fetchProfile({ access_token: access_token, auth_type: auth_type, region: region as string })
				if (!data) {
					Logger.error("KentKartAuthStore.tsx.fetchAccountInfo", error)
					return [false, error]
				}
				set({ user: { ...data, access_token: access_token } })
				Logger.info("KentKartAuthStore.tsx.fetchAccountInfo", "account info fetch successfull")
				return [data]
			},
			register: async (args) => {},
			logout: () => {
				Logger.info(`Logging out from account ${get().user?.name}`)
				set({ user: undefined, credentials: undefined })
			},
		}),
		{
			name: "kentkart-storage", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => storage), // (optional) by default, 'localStorage' is used
		}
	)
)
// useKentKartAuthStore.subscribe((state) => state.credentials)
