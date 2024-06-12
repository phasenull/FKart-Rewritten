import { createContext, useContext, useEffect, useState } from "react"
import User from "common/classes/User"
import Application from "common/Application"
import LoginTypes from "common/enums/LoginTypes"
import Logger from "common/Logger"
import { Favorites } from "common/interfaces/KentKart/Favorite"
import useGetFavorites from "common/hooks/kentkart/user/useGetFavorites"
import useGetProfileData from "common/hooks/kentkart/user/useGetProfileData"
import { Account } from "common/interfaces/KentKart/Account"
import { AxiosResponse } from "axios"
import { UseQueryResult } from "react-query"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import { LoggerContext } from "./LoggerContext"
export interface UserContextInterface {
	loggedUser: User | undefined
	isFetching: boolean
	favoritesQuery: UseQueryResult<AxiosResponse<Favorites & BaseKentKartResponse, any> | undefined, unknown>

	profileQuery: UseQueryResult<AxiosResponse<BaseKentKartResponse & { accountInfo: Account }, any>, unknown>
	loginUsingPhone: (args: { username: string; password: string }) => Promise<undefined | User>
	loginUsingEmail: (args: { username: string; password: string }) => Promise<undefined | User>
	isError: boolean
	error: string | undefined
	logout: () => void
}
export const UserContext = createContext<UserContextInterface>({} as any)
export function UserContextProvider(props: { children: any }) {
	const [loggedUser, setLoggedUser] = useState<User | undefined>()
	const favoritesQuery = useGetFavorites()
	const { appendLog } = useContext(LoggerContext)
	const profileQuery = useGetProfileData()
	useEffect(() => {
		async function get() {
			setisFetching(true)
			const user_data = await Application.database.get("user")
			const refresh_token = await Application.database.get("refresh_token")
			const access_token = await Application.database.get("access_token")
			let user
			// if (access_token) {
			// 	user = await User.fromAccessToken(access_token)
			// 	user.refresh_token = refresh_token
			// 	// if (user) {
			// 	// appendLog({title:"User Logged in!",description:"UserContext.init.access_token User logged in!",level:"info"})
			// 	// 	Logger.info("UserContext.init.access_token", "User logged in!")
			// 	// }
			// }
			if (refresh_token) {
				user = await User.fromRefreshToken(refresh_token)
				const fetch_profile = await user.fetchProfile()
				Application.logged_user = fetch_profile
				setisFetching(false)
				setLoggedUser(fetch_profile)
				console.log(fetch_profile)
				if (fetch_profile) {
					return
				}
					// appendLog({ title: "User Logged in!", description: "UserContext.init.refresh_token User logged in!", level: "info" })
				// if (user) {
				// Logger.info("UserContext.init.refresh_token", "User logged in!")
				// }
			}
			// appendLog({title:"User not logged in!",description:"UserContext.init",level:"warn"})
			Logger.info("UserContext.init", "User not logged in!")
			setisFetching(false)
			return
		}
		get()
	}, [])
	const [isFetching, setisFetching] = useState<boolean>(false)
	const [isError, setIsError] = useState<boolean>(false)
	const [error, setError] = useState<undefined | string>(undefined)
	// const logIn = useLog
	return (
		<UserContext.Provider
			value={{
				logout: async () => {
					setLoggedUser(undefined)
					await handleUserChange(undefined)
					Application.logged_user = undefined
					// appendLog({title:"User logged out!",description:"UserContext.logout",level:"info"})
					Logger.info("UserContext.logout", "User logged out!")
				},
				error: error,
				isError: isError,
				loggedUser: loggedUser,
				isFetching: isFetching,
				profileQuery: profileQuery,
				favoritesQuery: favoritesQuery,
				loginUsingPhone: async (args) => {
					setisFetching(true)

					let user = undefined
					try {
						user = await loginUsingPhone(args)
						// appendLog({title:"Logged in!",description:"UserContext.loginUsingPhone",level:"info"})
					} catch (e: any) {
						setError(e.message)
						// appendLog({title:"Error on login!",description:"UserContext.loginUsingPhone",level:"error"})
						setIsError(true)
					}
					await handleUserChange(user)
					setisFetching(false)
					setLoggedUser(user)
					return user
				},
				loginUsingEmail: async (args) => {
					setisFetching(true)
					let user = undefined
					try {
						user = await loginUsingEmail(args)
						// appendLog({title:"Logged in!",description:"UserContext.loginUsingEmail",level:"info"})
					} catch (e: any) {
						setError(e.message)
						// appendLog({title:"Error on login!",description:"UserContext.loginUsingEmail",level:"error"})
						setIsError(true)
					}
					await handleUserChange(user)
					setisFetching(false)
					setLoggedUser(user)
					return user
				},
			}}
		>
			{props.children}
		</UserContext.Provider>
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
		Logger.info("UserContext.handleUserChange", "User session is NOT valid!")
	}
	return
}
async function loginUsingPhone(args: { username: string; password: string }): Promise<undefined | User> {
	let user = new User()
	const r = await user.login({ auth_type: LoginTypes.phone, auth_value: args.username, password: args.password })
	if (!user.access_token) {
		return undefined
	}
	return user
}
async function loginUsingEmail(args: { username: string; password: string }): Promise<undefined | User> {
	let user = new User()
	const r = await user.login({ auth_type: LoginTypes.email, auth_value: args.username, password: args.password })
	if (!user.access_token) {
		return undefined
	}
	return user
}
