import { useMutation } from "react-query"
import { useFKartAuthStore } from "common/stores/FKartAuthStore"

export default function useGetUser() {
	const login = useFKartAuthStore((state) => state.login)
	return useMutation(
		["getUser"],
		(credentials: { username?: string; password?: string; twoFA_session_id?: string; twoFA_code?: string }) => {
			// cursed promise
			const promise = new Promise(async (resolve, reject) => {
				if (!credentials.username) return reject("Username field cannot be empty!")
				if (!credentials.password) return reject("Password field cannot be empty!")

				const [success, error] = await login({
					username: credentials.username,
					password: credentials.password,
					twoFA_code: credentials.twoFA_code,
				})
				if (!success) {
					return reject(error)
				}
				return resolve(success)
			})
			return promise
		},
		{
			retry: false,
		}
	)
}
