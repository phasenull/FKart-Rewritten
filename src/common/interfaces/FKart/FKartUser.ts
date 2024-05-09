export default interface FKartUser {
	activated_at: number
	banned_at: null | number
	deleted_at: null | number
	email: string
	favorites: null | []
	id: string
	is_active: boolean
	is_banned: boolean
	is_deleted: boolean
	is_verified_user: boolean
	label: string
	permissions: string[]
	phone: string | null
	requests: never //todo
	settings: {
		is_2fa_enabled: boolean
	}
	updated_at: number
	uploads: never //todo
	username: string
	created_at: number
}
