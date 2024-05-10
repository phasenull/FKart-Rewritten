export default interface ICredentials {
	username?: string
	password?: string
	captcha_token?: string
	twoFA_code?: string
	twoFA_session?: string
}