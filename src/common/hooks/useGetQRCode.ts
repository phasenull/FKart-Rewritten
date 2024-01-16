import { useQuery } from "react-query"
import Application from "../Application"
import axios from "axios"

export function getQRCode(data: string) {
	return (
		"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + data
	)
}
