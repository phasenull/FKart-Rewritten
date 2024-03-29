import { useQuery } from "react-query"
import Application from "../Application"
import axios from "axios"
import Logger from "../Logger"

export function getQRCode(data: string | undefined) {
	if (!data) {
		return
	}
	Logger.info(`REQUEST useGetQRCode ${data.slice(0, 10)}...`)
	return (
		"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + data
	)
}
