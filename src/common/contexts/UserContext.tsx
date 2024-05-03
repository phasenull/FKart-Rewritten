import { createContext, useState } from "react"
import User from "../classes/User"
import Application from "../Application"
import LoginTypes from "../enums/LoginTypes"
export interface UserContextInterface {
	loggedUser: User | undefined
	isFetching: boolean
	loginUsingPhone: (args: { username: string; password: string }) => Promise<undefined | User>
	loginUsingEmail: (args: { username: string; password: string }) => Promise<undefined | User>
	isError: boolean
	error:string | undefined
}
export const UserContext = createContext<UserContextInterface>({} as any)
export function UserContextProvider(props: { children: any }) {
	const [loggedUser, setLoggedUser] = useState<User | undefined>(Application.logged_user || undefined)
	const [isFetching, setisFetching] = useState<boolean>(false)
	const [isError, setIsError] = useState<boolean>(false)
	const [error, setError] = useState<undefined | string>(undefined)
	// const logIn = useLog
	return (
		<UserContext.Provider
			value={{
				error: error,
				isError:isError,
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
