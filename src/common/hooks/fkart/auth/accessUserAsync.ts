import axios from "axios"
import Application from "common/Application"
import Logger from "common/Logger"

export async function getAccessUserAsync(refresh_token?: string) {
	if (!refresh_token) return
	Logger.info("REQUEST getUser")
	return axios(`${Application.fkart_endpoints.auth}/user/access`, {
		method: "POST",
		data: JSON.stringify({
			refresh_token: refresh_token,
		}),
	})
}
