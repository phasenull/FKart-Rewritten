import { StyleSheet } from "react-native"
import User from "./classes/User"
import Database from "./classes/Database"
import Logger from "./Logger"
import LoginTypes from "./enums/LoginTypes"
import API from "./API"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { Image } from "react-native"
import { PREFETCH_IMAGES } from "./constants"

export default abstract class Application {
	public static readonly source_url = "https://github.com/phasenull/FKart-Rewritten"
	public static region: string = "004"
	public static version: string = "1.0.0"
	public static readonly expo_updates_check_interval = 3*24*60*60*1_000 //check update in every 3 days
	public static name: string = "FKart"
	public static readonly base_server = "kentkart.com"
	public static readonly base_fkart_server = "fkart.project.phasenull.dev"
	public static readonly endpoints = {
		base: `https://${Application.base_server}`,
		auth: `https://auth.${Application.base_server}`,
		service: `https://service.${Application.base_server}`,
	}
	public static readonly fkart_endpoints = {
		bus: `https://bus.api.${Application.base_fkart_server}`,
		static: `https://static.api.${Application.base_fkart_server}`,
		antir2d2: `https://anti-r2d2.api.${Application.base_fkart_server}`,
		auth: `https://auth.api.${Application.base_fkart_server}`,
	}
	public static getFormattedVersion() {
		return `${Application.name} v${Application.version}-dev`
	}
	public static __is_init: boolean = false
	public static logged_user: User | undefined = undefined
	public static readonly database = Database
	public static readonly styles = {
		primary: "#ffd60a",
		dark: "#EFEFEF",
		primaryDark: "#ffc300",
		secondary: "#003566",
		secondaryDark: "#001d3d",
		black: "#000000",
		white: "#ffffff",
		error: "#E95555",
		success: "#4BB543",
	}
	public static readonly sync_interval = 20 * 1000
	public static readonly theme = StyleSheet.create({
		buttonPrimary: {
			backgroundColor: Application.styles.primaryDark,
			color: Application.styles.white,
			borderRadius: 10,
		},
		buttonSecondary: {
			backgroundColor: Application.styles.secondary,
			color: Application.styles.white,
			borderRadius: 10,
		},
		modal: {
			backgroundColor: Application.styles.white,
			borderRadius: 10,
		},
	})
	public static makeKentKartRequest(input: string | URL | Request, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse<any, any>> {
		// get url host
		const whitelist = [...Object.values(this.endpoints)]
		const check = whitelist.map((v) => input.toString().includes(v)).includes(true)
		if (!check) {
			throw new Error(`Url ${input} is not whitelisted!`)
		}
		return axios(input as string, {
			headers: {
				...config?.headers,
				...{
					Authorization: `Bearer ${Application.logged_user?.access_token}`,
					"User-Agent": Application.getFormattedVersion(),
					"fkart-version": Application.version,
					"fkart-environment": "dev",
					// "Origin": "https://m.kentkart.com",
					// "Content-Type": "application/json",
				},
			},
			...config,
		})
	}

	public static async login({ auth_type, auth_value, password }: { auth_type: LoginTypes; auth_value: string; password: string }) {
		let user = new User()
		await user.login({ auth_type, auth_value, password })
		if (!user.access_token) {
			return false
		}
		this.logged_user = user
		await this.database.set("refresh_token", user.refresh_token)
		await this.database.set("access_token", user.access_token)
		await this.database.set("user", user.toJSON())
		Logger.info("Application.login", "User logged in!", user.toJSON())
		return user
	}

	public static async loginWithRefreshToken({ refresh_token }: { refresh_token: string }) {
		const user = new User()
		user.refresh_token = refresh_token
		return user
	}
	public static async __INIT() {
		if (this.__is_init) {
			return
		}
		PREFETCH_IMAGES.forEach((url:string)=>{
			Image.prefetch(url).catch(()=>{
				Logger.warning("Application.__INIT.PREFETCH_IMAGES","Failed to prefetch",url)
			})
		})
		
		this.__is_init = true
	}
	public static async userAuthCookieTimedOut() {
		const user = this.logged_user
		if (!user || !user.refresh_token) {
			return false
		}

		const new_user = await User.fromRefreshToken(user.refresh_token)
		if (!new_user) {
			return false
			this.logged_user = undefined
		}
		this.logged_user = new_user
	}
	public static CONVERT_TO_DATE(date: string | undefined) {
		if (!date) {
			return
		}
		return new Date(date)
	}
	public static async TO_CACHE(key: string, value: any) {
		await this.database.set(`__cache__${key}`, value)
	}
	public static async FROM_CACHE(key: string) {
		return await this.database.get(`__cache__${key}`)
	}
	public static DATE_TO_STRING(date: Date) {
		return date.toISOString()
	}
	public static DATE_DIFF(date1: Date, date2: Date) {
		return date1.getTime() - date2.getTime()
	}
	public static DATE_COUNTDOWN(date: Date) {
		const diff = this.DATE_DIFF(date, new Date())
		const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
		const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30))
		const days = Math.floor(diff / (1000 * 60 * 60 * 24))
		const hours = Math.floor(diff / (1000 * 60 * 60))
		const minutes = Math.floor(diff / (1000 * 60))
		const seconds = Math.floor(diff / 1000)
		return { years, months, days, hours, minutes, seconds }
	}
}
