import LoginTypes from "../enums/LoginTypes"
import API from "../API"
import Application from "../Application"
import Logger from "../Logger"

export default class User {
	//💀💀💀💀
	name?: string
	surname?: string
	email?: string
	phone?: string
	refresh_token?: string
	access_token?: string
	user_id?: string
	accountId?: string
	identityNo?: string
	activationStatus?: string
	accountCreateDate?: string
	cCardNo?: string
	cCardExprMonth?: string
	cCardExprYear?: string
	nfcCardNo?: string
	systemid?: string
	datetime?: string
	timeDiff?: string
	runningTime?: string
	payment_type?: string
	home?: {
		latitude: number
		longitude: number
	}
	country_code?: string
	work?: {
		latitude: number
		longitude: number
	}
	file_url?: number
	additional_info?: null | string

	constructor() {
		return this
	}
	public async login({ auth_type, auth_value, password }: { auth_type: LoginTypes; auth_value: string; password: string }) {
		console.log(`Attempting to login ${auth_value} ${password.slice(0, 3)}... ${auth_type}`)
		const refresh_token = await API.getRefreshToken({ auth_type, auth_value, password })
		const access_token = await API.getAuthToken({ refresh_token })
		this.refresh_token = refresh_token
		this.access_token = access_token

		return this
	}

	static fromJSON(json: Object): User | null {
		if (!json) {
			return null
		}
		const new_user = new User()
		Object.entries(json).map(([key, value]) => {
			new_user[key as keyof User] = json[key]
		})
		return new_user
	}
	static fromString(json: string): User | null {
		return this.fromJSON(JSON.parse(json))
	}
	public toJSON(): string {
		return JSON.stringify(Object.assign({}, this))
	}
	static async fromRefreshToken(refresh_token: string) {
		const access_token = (await API.getAuthToken({ refresh_token })) || ""
		const user = await this.fromAccessToken(access_token)
		user.refresh_token = refresh_token
		return user
	}
	static async fromAccessToken(access_token: string) {
		const user = new User()
		user.access_token = access_token
		return user
	}
}
