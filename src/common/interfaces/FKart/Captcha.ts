export default interface Captcha {
	session_id: string
	__code: string // dev only, will be removed soon.
	valid_until: number
	created_at: number
	used_at: number | null
	activated_at: number | null
}
