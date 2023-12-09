import LoginTypes from "../../enums/LoginTypes"
import API from "../API"
import Application from "../Application"
import Logger from "../Logger"

export default class User {
	name: string
	surname?: string
	email?: string
	phone?: string
	refresh_token?: string
	access_token?: string

	constructor({ name, surname, email, phone }: { name: string; surname: string; email?: string; phone?: string }) {
		this.name = name
		this.surname = surname
		this.email = email
		this.phone = phone
		return this
	}
	public async login({ auth_type, auth_value, password }: { auth_type: LoginTypes; auth_value: string; password: string }) {
		console.log(`Attempting to login ${auth_value} ${password.slice(0, 1)}... ${auth_type}`)
		const refresh_token = await API.getRefreshToken({ auth_type, auth_value, password })
		const access_token = await API.getAuthToken({ refresh_token })
		this.refresh_token = refresh_token
		this.access_token = access_token
		Logger.info("User.login", "User logged in!")
		return this
	}

	static fromJSON(json: string) : User | null {
		const obj = JSON.parse(json)
		if (!obj) {return null}
		const new_user = new User({ name: obj.name, surname: obj.surname, email: obj.email, phone: obj.phone })
		new_user.refresh_token = obj.refresh_token
		new_user.access_token = obj.access_token
		return new_user
	}
	public toJSON() : string {
		return JSON.stringify(this)
	}
}
