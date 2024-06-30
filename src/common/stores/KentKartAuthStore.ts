import API from "common/API"
import ApplicationConfig from "common/ApplicationConfig"
import AuthTypes from "common/enums/LoginTypes"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import Logger from "common/Logger"
import { createStore, create } from "zustand"
interface KentKartAuthStore {
	user: undefined | IKentKartUser

	__initF:()=>void
	__init:boolean
	region: string|undefined
	auth_type: string
	fetchAccessToken: (refresh_token: string) => Promise<[false, string | undefined] | [string]>
	fetchAccountInfo: () => Promise<[false, string] | [IKentKartUser]>
	credentials: { access_token?: string; refresh_token?: string }
	login: (args: { username: string; password: string; auth_type: AuthTypes }) => Promise<[true] | [false, string | undefined]>
	register: (args: {}) => Promise<void>
	setRegion: (region:string) => void
}

export const useKentKartAuthStore = create<KentKartAuthStore>((set, get) => ({
	user: undefined,
	region: undefined,
	__init:false,

	auth_type: "04", //undefined,
	credentials: {
		access_token: undefined,
		refresh_token: undefined,
	},
	setRegion: async (region:string) => {
		set({region:region})
		const db = ApplicationConfig.database
		await db.set("kentkart.region",region)
	},
	__initF: async () => {
		if (get().__init) {return}
		Logger.info("KentKartAuthStore.__initF","INIT")
		set({__init:true})
		const db = ApplicationConfig.database
		// const refresh_token = await db.get("kentkart.refresh_token")
		const access_token = await db.get("kentkart.access_token")
		const auth_type = await db.get("kentkart.auth_type") || "4"
		const region = await db.get("kentkart.region")
		console.log(`init region: ${region} auth_type: ${auth_type}`)
		// Logger.info("KentKartAuthStore.__initF",`refresh_token: ${refresh_token}`)
		set({ credentials: { access_token: access_token },auth_type:auth_type,region:region })
		if (!access_token) return
		await get().fetchAccountInfo()
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
		const [access_token, access_token_error] = await (get().fetchAccessToken(one_time_code))
		console.log("login successfull",access_token)
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
		await ApplicationConfig.database.set("kentkart.access_token",access_token)
		set({ credentials: { access_token: access_token, refresh_token: refresh_token } })
		await get().fetchAccountInfo()
		return [access_token]
	},
	fetchAccountInfo: async () => {
		console.log("fetching account info")
		const { credentials, auth_type, region } = get()
		const { access_token } = credentials
		if (!access_token) return [false, "access token not found, please log in"]
		const [data, error] = await API.fetchProfile({ access_token: access_token, auth_type:auth_type,region:region as string })
		if (!data) {
			Logger.error("account info fetch error",error)
			return [false, error]
		}
		set({ user: {...data,access_token:access_token} })
		console.log("account info fetch successfull")
		return [data]
	},
	register: async (args) => {},
}))
// useKentKartAuthStore.subscribe((state) => state.credentials)
