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
export interface IFKartContext {
	fkartUser: FKartUser | undefined
	userManager: {
		__pushUserQuery: UseQueryResult<
			| AxiosResponse<
					BaseFKartResponse & {
						user:FKartUser
					}
			  >
			| undefined
		>
		credentials:ICredentials | undefined
		setCredentials:(credentials:ICredentials)=>void
		pushUser:()=>void
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
	fetchRefreshToken: (args: { username: string; password: string }) => Promise<undefined | User>
}
export const FKartContext = createContext<IFKartContext>({} as any)
export function FKartContextProvider(props: { children: any }) {
	const { appendLog } = useContext(LoggerContext)

	const [captchaSession, setCaptchaSession] = useState<Captcha & {captcha_token?:string} | undefined>()
	const [loggedUser, setLoggedUser] = useState<FKartUser | undefined>()

	const [credentials, setCredentials] = useState<
		| ICredentials
		| undefined
	>()
	const [isFetching, setisFetching] = useState<boolean>(false)
	const [isError, setIsError] = useState<boolean>(false)
	const [error, setError] = useState<undefined | string>(undefined)
	const captchaChallangeQuery = useFetchCaptcha()
	const captchaValidateQuery = useValidateCaptcha(captchaSession)
	const pushUserQuery = usePushUser(credentials,captchaSession?.captcha_token)
	const accessUserQuery = usePushUser(credentials)
	const getUserQuery = usePushUser(credentials)
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
		setCaptchaSession({...captcha_result,captcha_token:undefined})
	}, [captchaChallangeQuery.data])

	// captcha validate listener
	useEffect(() => {
		const captchaValidateResult = captchaValidateQuery.data?.data
		console.log("captchaValidateResult",captchaValidateResult)
		if (!captchaValidateResult || !captchaValidateResult.captcha_token) {
			return
		}
		// appendLog({ title: `Captcha validated! ${captchaValidateResult?.captcha.__code}`, level: "info" })
		setCaptchaSession({ ...captchaValidateResult?.captcha, captcha_token: captchaValidateQuery.data?.data.captcha_token })
	}, [captchaValidateQuery.data])

	function pushUser() {
		if (!captchaSession) {
			// appendLog({ title: "Captcha session is undefined!", level: "warn" })
			return
		}
		pushUserQuery.refetch()
	}
	return (
		<FKartContext.Provider
			value={{
				userManager:{
					credentials:credentials,
					setCredentials:setCredentials,
					pushUser:pushUser,
					__pushUserQuery:pushUserQuery,
				},
				fkartUser: loggedUser,
				fetchRefreshToken: async (args: { username: string; password: string; twoFA?: string }) => {
					setisFetching(true)
					let user = undefined
					try {
						// appendLog({ title: "FKart Logged in!", description: "FKartEditorContext.fetchRefreshToken", level: "info" })
					} catch (e: any) {
						setError(e.message)
						// appendLog({ title: "Error on FKart login!", description: "FKartEditorContext.fetchRefreshToken", level: "error" })
						setIsError(true)
					}
					setisFetching(false)
					setLoggedUser(user)
					return user
				},
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
