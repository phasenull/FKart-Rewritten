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
		const refresh_token = await API.getRefreshToken({
			auth_type,
			auth_value,
			password,
		})
		// console.log("got refresh token", refresh_token)
		if (!refresh_token) {
			return false
		}
		const auth_token = await API.getAuthToken({
			refresh_token,
		})
		const access_token = auth_token
		// console.log("got access token", access_token)
		if (!access_token) {
			return false
		}
		this.refresh_token = refresh_token
		this.access_token = access_token
		const profile_data = await API.getProfile({ user: this })
		// console.log("got profile data", profile_data)
		Object.assign(this, profile_data)

		return this
	}

	static fromJSON(json: User): User | null {
		if (!json) {
			return null
		}
		const new_user = new User()
		new_user.name = json.name
		new_user.surname = json.surname
		new_user.email = json.email
		new_user.phone = json.phone
		new_user.refresh_token = json.refresh_token
		new_user.access_token = json.access_token
		new_user.user_id = json.user_id
		new_user.accountId = json.accountId
		new_user.identityNo = json.identityNo
		new_user.activationStatus = json.activationStatus
		new_user.accountCreateDate = json.accountCreateDate
		new_user.cCardNo = json.cCardNo
		new_user.cCardExprMonth = json.cCardExprMonth
		new_user.cCardExprYear = json.cCardExprYear
		new_user.nfcCardNo = json.nfcCardNo
		new_user.systemid = json.systemid
		new_user.datetime = json.datetime
		new_user.timeDiff = json.timeDiff
		new_user.runningTime = json.runningTime
		new_user.payment_type = json.payment_type
		new_user.home = json.home
		new_user.country_code = json.country_code
		new_user.work = json.work
		new_user.file_url = json.file_url
		new_user.additional_info = json.additional_info
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

	async getProfile() {
		const profile_data = await API.getProfile({ user: this })
		Object.assign(this, profile_data)
		return this
	}
}
