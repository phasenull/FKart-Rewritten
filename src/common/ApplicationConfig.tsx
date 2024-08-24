import { StyleSheet } from "react-native"
import Database from "./classes/Database"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import * as Updates from "expo-updates"
export default abstract class ApplicationConfig {
	public static readonly source_url = "https://github.com/phasenull/FKart-Rewritten"
	public static region: string = "004"
	public static version: string = "1.0.0"
	public static readonly expo_updates_check_interval = 3 * 24 * 60 * 60 * 1_000 //check update in every 3 days
	public static name: string = "FKart"
	public static readonly base_server = "kentkart.com"
	public static readonly base_fkart_server = "fkart.project.phasenull.dev"
	public static readonly endpoints = {
		base: `https://${ApplicationConfig.base_server}`,
		auth: `https://auth.${ApplicationConfig.base_server}`,
		service: `https://service.${ApplicationConfig.base_server}`,
	}
	public static readonly fkart_endpoints = {
		bus: `https://bus.api.${ApplicationConfig.base_fkart_server}`,
		static: `https://static.api.${ApplicationConfig.base_fkart_server}`,
		antir2d2: `https://anti-r2d2.api.${ApplicationConfig.base_fkart_server}`,
		auth: `https://auth.api.${ApplicationConfig.base_fkart_server}`,
		api: `https://api.${ApplicationConfig.base_fkart_server}`,
	}
	public static getFormattedVersion() {
		return `${ApplicationConfig.name}:${Updates.channel || "expogo"}:${Updates.manifest.id}`
	}
	public static __is_init: boolean = false
	public static logged_user: undefined = undefined
	public static readonly database = Database

	public static readonly sync_interval = 20 * 1000

	public static makeKentKartRequest(input: string | URL | Request, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse<any, any>> {
		// get url host
		// TODO: also wrap it in KatikJS (phase2)
		const whitelist = Object.values(this.endpoints)
		const check = !!whitelist.find((whitelisted_url)=>input.toString().startsWith(whitelisted_url))
		if (!check) {
			throw new Error(`Url ${input} is not whitelisted!`)
		}
		const url = new URL(input as string)
		url.searchParams.append("cache_bypass",`${Math.floor(Math.random()*1000)}`)
		return axios(url.toString(), {
			...config,
			headers: {
				"User-Agent": ApplicationConfig.getFormattedVersion(),
				"fkart-version": ApplicationConfig.version,
				"fkart-environment": "dev",
				// "Origin": "https://m.kentkart.com",
				// "Content-Type": "application/json",
				...config?.headers,
			},
		})
	}
}
