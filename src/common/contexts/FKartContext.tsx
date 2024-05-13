import { AxiosResponse } from "axios"
import User from "common/classes/User"
import useFetchCaptcha from "common/hooks/fkart/anti-r2d2/useFetchCaptcha"
import useValidateCaptcha from "common/hooks/fkart/anti-r2d2/useValidateCaptcha"
import usePushUser from "common/hooks/fkart/auth/usePushUser"
import BaseFKartResponse from "common/interfaces/FKart/BaseFKartResponse"
import Captcha from "common/interfaces/FKart/Captcha"
import FKartUser from "common/interfaces/FKart/FKartUser"
import ICredentials from "common/interfaces/app/Credentials"
import { createContext, useContext, useEffect, useState } from "react"
import { UseQueryResult } from "react-query"
import { LoggerContext } from "./LoggerContext"
import useGetUser from "common/hooks/fkart/auth/useGetUser"
import Logger from "common/Logger"
import Application from "common/Application"
export interface IFKartContext {
	fkartUser: FKartUser | undefined
	userManager: {
		__pushUserQuery: UseQueryResult<
			| AxiosResponse<
					BaseFKartResponse & {
						user: FKartUser
					}
			  >
			| undefined
		>
		__getUserQuery: UseQueryResult<
			| AxiosResponse<
					| BaseFKartResponse & {
							session?: { user: FKartUser; refresh_token: string; is_2fa_enabled: boolean }
							twoFA_session_id?: string
					  }
			  >
			| undefined
		>
		credentials: ICredentials | undefined
		setCredentials: (credentials: ICredentials) => void
		pushUser: () => void
		getUser: () => void
		logout: () => void
	}
	captchaManager: {
		captchaSession: Captcha | undefined
		challange: () => void
		setCode: (code: string) => void
		validate: () => void
		__captchaChallangeQuery: UseQueryResult<
			| AxiosResponse<
					BaseFKartResponse & {
						captcha: Captcha
					}
			  >
			| undefined
		>
		__captchaValidateQuery: UseQueryResult<
			| AxiosResponse<
					BaseFKartResponse & {
						captcha: Captcha
						captcha_token: string
					}
			  >
			| undefined
		>
	}
}
export const FKartContext = createContext<IFKartContext>({} as any)
export function FKartContextProvider(props: { children: any }) {
	const { appendLog } = useContext(LoggerContext)

	const [captchaSession, setCaptchaSession] = useState<(Captcha & { captcha_token?: string }) | undefined>()
	const [loggedUser, setLoggedUser] = useState<FKartUser | undefined>()

	const [credentials, setCredentials] = useState<ICredentials | undefined>()
	const captchaChallangeQuery = useFetchCaptcha()
	const captchaValidateQuery = useValidateCaptcha(captchaSession)
	const pushUserQuery = usePushUser(credentials, captchaSession?.captcha_token)
	// const accessUserQuery = usePushUser(credentials)
	const getUserQuery = useGetUser(credentials)
	function challange() {
		captchaChallangeQuery.refetch()
	}
	function validate() {
		if (!captchaSession) {
			return
		}
		captchaValidateQuery.refetch()
	}
	// captcha listener
	useEffect(() => {
		const captcha_result = captchaChallangeQuery.data?.data?.captcha
		if (!captcha_result) {
			return
		}
		// appendLog({ title: `Captcha fetched! ${captcha_result.__code}`, level: "info" })
		setCredentials({ ...credentials, captcha_token: captcha_result.token })
		setCaptchaSession({ ...captcha_result, captcha_token: undefined })
	}, [captchaChallangeQuery.data])
	async function saveUser(user:FKartUser) {
		console.log("Save user!",user.username)
		await Application.database.set("fkart.user", user)
	}
	async function loadUser() {
		const loadedUser = await Application.database.get("fkart.user") as FKartUser
		console.log("Loading FKart User!",loadedUser?.username || "undefined")
		setLoggedUser(loadedUser)
	}
	useEffect(() => {
		const data = getUserQuery.data?.data
		console.log("getUser request update")
		if (!data) return console.log("no data!")
		if (data.session) {
		saveUser(data.session.user)
			setLoggedUser(data.session.user)
		}
	}, [getUserQuery.data])
	// captcha validate listener
	useEffect(() => {
		const captchaValidateResult = captchaValidateQuery.data?.data
		console.log("captchaValidateResult", captchaValidateResult)
		if (!captchaValidateResult || !captchaValidateResult.captcha_token) {
			return
		}
		// appendLog({ title: `Captcha validated! ${captchaValidateResult?.captcha.__code}`, level: "info" })
		setCaptchaSession({ ...captchaValidateResult?.captcha, captcha_token: captchaValidateQuery.data?.data.captcha_token })
	}, [captchaValidateQuery.data])
	useEffect(() => {
		loadUser()
	}, [])
	useEffect(() => {
		Logger.info("UserContext", "Detected change in credentials!")
		if (credentials?.twoFA_code && credentials.twoFA_session) {
			getUser()
			setCredentials({ ...credentials, twoFA_code: undefined })
		}
	}, [credentials])
	function getUser() {
		console.log("pre-fetch credentials", credentials)
		getUserQuery.refetch()
	}
	function pushUser() {
		if (!captchaSession) {
			// appendLog({ title: "Captcha session is undefined!", level: "warn" })
			return
		}
		pushUserQuery.refetch()
	}
	function logout() {
		Logger.info("FKartContext", "Logged out!")
		setCredentials(undefined)
		setLoggedUser(undefined)
	}
	return (
		<FKartContext.Provider
			value={{
				userManager: {
					credentials: credentials,
					setCredentials: setCredentials,
					pushUser: pushUser,
					getUser: getUser,
					logout: logout,
					__getUserQuery: getUserQuery,
					__pushUserQuery: pushUserQuery,
				},
				fkartUser: loggedUser,
				captchaManager: {
					__captchaChallangeQuery: captchaChallangeQuery,
					challange: challange,
					validate: validate,
					setCode: (code) => {
						if (captchaSession) {
							setCaptchaSession({
								...captchaSession,
								__code: code,
							})
						} else {
							appendLog({ title: "Cant set code without fetching captcha!", level: "warn" })
						}
					},
					captchaSession: captchaSession,
					__captchaValidateQuery: captchaValidateQuery,
				},
			}}
		>
			{props.children}
		</FKartContext.Provider>
	)
}
