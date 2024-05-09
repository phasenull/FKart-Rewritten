import { createContext, useContext, useEffect, useState } from "react"
import User from "../classes/User"
import Application from "../Application"
import LoginTypes from "../enums/LoginTypes"
import Logger from "../Logger"
import { Favorites } from "../interfaces/KentKart/Favorite"
import useGetFavorites from "../hooks/kentkart/user/useGetFavorites"
import useGetProfileData from "../hooks/kentkart/user/useGetProfileData"
import { Account } from "../interfaces/KentKart/Account"
import { AxiosResponse } from "axios"
import { UseQueryResult } from "react-query"
import { BaseKentKartResponse } from "../interfaces/KentKart/BaseKentKartResponse"
import { LoggerContext } from "./LoggerContext"
import Captcha from "../interfaces/FKart/Captcha"
import useFetchCaptcha from "../hooks/fkart/anti-r2d2/useFetchCaptcha"
export interface FKartEditorContextInterface {
	fkartUser: User | undefined
	captchaSession:Captcha | undefined
	isFetching: boolean
	fetchRefreshToken: (args: { username: string; password: string }) => Promise<undefined | User>
	isError: boolean
	error: string | undefined
	logout: () => void
}
export const FKartContext = createContext<FKartEditorContextInterface>({} as any)
export function FKartContextProvider(props: { children: any }) {
	const [loggedUser, setLoggedUser] = useState<User | undefined>()
	const [captchaSession,setCaptchaSession] = useState<Captcha>()
	const {appendLog} = useContext(LoggerContext)
	const [isFetching, setisFetching] = useState<boolean>(false)
	const [isError, setIsError] = useState<boolean>(false)
	const [error, setError] = useState<undefined | string>(undefined)
	const captchaQuery = useFetchCaptcha()

	function challange() {
		captchaQuery.refetch()
	}
	return (
		<FKartContext.Provider
			value={{
				logout: async () => {
					setLoggedUser(undefined)
					await handleUserChange(undefined)
					Application.logged_user = undefined
					appendLog({title:"User logged out!",description:"UserContext.logout",level:"info"})
					Logger.info("UserContext.logout", "User logged out!")
				},
				error: error,
				isError: isError,
				fkartUser: loggedUser,
				captchaSession:captchaSession,
				isFetching: isFetching,
				fetchRefreshToken: async (args:{username:string,password:string,twoFA?:string}) => {
					setisFetching(true)
					let user = undefined
					try {
						appendLog({title:"Logged in!",description:"FKartEditorContext.fetchRefreshToken",level:"info"})
					} catch (e: any) {
						setError(e.message)
						appendLog({title:"Error on FKart login!",description:"FKartEditorContext.fetchRefreshToken",level:"error"})
						setIsError(true)
					}
					setisFetching(false)
					setLoggedUser(user)
					return user
				},
			}}
		>
			{props.children}
		</FKartContext.Provider>
	)
}
async function handleUserChange(user: User | undefined) {
	Application.logged_user = user
	if (user) {
		await Application.database.set("access_token", user?.access_token)
		await Application.database.set("refresh_token", user?.refresh_token)
		Logger.info("UserContext.handleUserChange", "User session is valid, auth successfull!")
	} else {
		await Application.database.removeItem("access_token")
		await Application.database.removeItem("refresh_token")
		Logger.info("UserContext.handleUserChange","User session is NOT valid!")
	}
	return
}