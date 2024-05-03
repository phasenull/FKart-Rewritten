import { createContext, useEffect, useState } from "react"
import User from "../classes/User"
import Application from "../Application"
import LoginTypes from "../enums/LoginTypes"
import Logger from "../Logger"
export interface UserContextInterface {
	loggedUser: User | undefined
	isFetching: boolean
	loginUsingPhone: (args: { username: string; password: string }) => Promise<undefined | User>
	loginUsingEmail: (args: { username: string; password: string }) => Promise<undefined | User>
	isError: boolean
	error: string | undefined
	logout: () => void
}
export const UserContext = createContext<UserContextInterface>({} as any)
export function UserContextProvider(props: { children: any }) {
	const [loggedUser, setLoggedUser] = useState<User | undefined>(undefined)
	useEffect(() => {
		async function get() {
			setisFetching(true)
			const user_data = await Application.database.get("user")
			const refresh_token = await Application.database.get("refresh_token")
			const access_token = await Application.database.get("access_token")
			let user
			if (access_token) {
				user = await User.fromAccessToken(access_token)
				user.refresh_token = refresh_token
				Logger.info("UserContext.init.access_token", "User logged in!")
			} else if (refresh_token) {
				user = await User.fromRefreshToken(refresh_token)
				Logger.info("UserContext.init.refresh_token", "User logged in!")
			}

			if (!user) {
				Logger.info("UserContext.init", "User not logged in!")
				setisFetching(false)
				return
			}
			await user.getProfile()

			Application.logged_user = user
			setisFetching(false)
			setLoggedUser(user)
		}
		get()
	}, [])
	useEffect(() => {
		async function handle() {
			if (loggedUser) {
				await Application.database.set("access_token", loggedUser.access_token)
				Application.logged_user = loggedUser
				return
			}
			Application.logged_user = undefined
			await Application.database.set("user", null)
			await Application.database.set("refresh_token", null)
			await Application.database.set("access_token", null)
			Logger.info("UserContext.handle", "User session is invalid!")
		}
		handle()
	}, [loggedUser])
	const [isFetching, setisFetching] = useState<boolean>(false)
	const [isError, setIsError] = useState<boolean>(false)
	const [error, setError] = useState<undefined | string>(undefined)
	// const logIn = useLog
	return (
		<UserContext.Provider
			value={{
				logout: async () => {
					Application.logged_user = undefined
					await Application.database.set("user", null)
					await Application.database.set("refresh_token", null)
					await Application.database.set("access_token", null)
					Logger.info("UserContext.logout", "User logged out!")
				},
				error: error,
				isError: isError,
				loggedUser: loggedUser,
				isFetching: isFetching,
				loginUsingPhone: async (args) => {
					setisFetching(true)

					let user = undefined
					try {
						user = await loginUsingPhone(args)
					} catch (e: any) {
						setError(e.message)
						setIsError(true)
					}
					setisFetching(false)
					setLoggedUser(user)
					return user
				},
				loginUsingEmail: async (args) => {
					setisFetching(true)
					let user = undefined
					try {
						user = await loginUsingEmail(args)
					} catch (e: any) {
						setError(e.message)
						setIsError(true)
					}
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
