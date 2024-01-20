import { StyleSheet } from "react-native"
import User from "./classes/User"
import Database from "./classes/Database"
import Logger from "./Logger"
import LoginTypes from "./enums/LoginTypes"
import API from "./API"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

export default abstract class Application {
	public static region: string = "004"
	public static version: string = "1.0.0"
	public static name: string = "FKart"
	public static readonly base_server = "kentkart.com"
	public static readonly base_fkart_server = "api.fkart.project.phasenull.dev"
	public static readonly endpoints = {
		base: `https://${Application.base_server}`,
		auth: `https://auth.${Application.base_server}`,
		service: `https://service.${Application.base_server}`,
	}
	public static readonly fkart_endpoints = {
		base: `${Application.base_fkart_server}`,
		bus: `https://bus.${Application.base_fkart_server}`,
	}
	public static __is_init: boolean = false
	public static logged_user: User | null = null
	public static readonly database = Database
	public static readonly styles = {
		primary: "#ffd60a",
		dark: "#EFEFEF",
		primaryDark: "#ffc300",
		secondary: "#003566",
		secondaryDark: "#001d3d",
		black: "#000000",
		white: "#ffffff",
		warning: "#E95555",
		success: "#4BB543",
	}
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
	public static makeRequest(input: string | URL | Request, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse<any, any>> {
		// get url host
		const whitelist = [...Object.values(this.endpoints)]
		const check = whitelist.map((v) => input.toString().includes(v)).includes(true)
		if (!check) {
			throw new Error(`Url ${input} is not allowed!`)
		}
		return axios(input as string, {
			headers: {
				...config?.headers,
				...{
					Authorization: `Bearer ${Application.logged_user?.access_token}`,
					"User-Agent": "FKart",
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
	public static async logout() {
		this.logged_user = null
		await this.database.set("user", null)
		await this.database.set("refresh_token", null)

		await this.database.set("access_token", null)
		Logger.info("Application.logout", "User logged out!")
	}
	public static async __INIT() {
		if (this.__is_init) {
			return
		}
		const user_data = await this.database.get("user")
		const refresh_token = await this.database.get("refresh_token")
		const access_token = await this.database.get("access_token")
		let user: User | null = null
		if (access_token) {
			user = await User.fromAccessToken(access_token)
			user.refresh_token = refresh_token
			Logger.info("Application.__INIT.access_token", "User logged in!")
		} else if (refresh_token) {
			user = await User.fromRefreshToken(refresh_token)
			Logger.info("Application.__INIT.refresh_token", "User logged in!")
		}

		if (!user) {
			Logger.info("Application.__INIT", "User not logged in!")
			this.__is_init = true
			return
		}
		await user.getProfile()

		this.logged_user = user
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
			this.logged_user = null
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
