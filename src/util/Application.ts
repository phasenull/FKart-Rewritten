import { StyleSheet } from "react-native"
import User from "./classes/User"
import Database from "./classes/Database"
import Logger from "./Logger"

export default abstract class Application {
	public static region: string = "04"
	public static version: string = "1.0.0"
	public static name: string = "FKart"
	private static __is_init: boolean = false
	public static logged_user:User|null = null
	public static readonly database = Database
	public static readonly styles = {
		primary: "#ffd60a",
		primaryDark: "#ffc300",
		secondary: "#003566",
		secondaryDark: "#001d3d",
		black: "#000000",
		white: "#ffffff",
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
		}
	})
	public static fetch(input: string | URL | Request, init?: RequestInit | undefined): Promise<Response> {
		return fetch(input, { ...init, ...{ headers: { "User-Agent": "FKart", "fkart-version": Application.version, "fkart-environment": "dev" } } })
	}

	public static async __INIT() {
		if (this.__is_init) {
			return
		}
		this.__is_init = true

		const user_data = await this.database.get("user")
		const user = User.fromJSON(user_data)
		if (user) {
			this.logged_user = user
			Logger.info("Application.__INIT", "User logged in!")
		}
	}
	
}
