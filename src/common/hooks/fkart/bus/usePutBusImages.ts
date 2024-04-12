import axios from "axios"
import Application from "../../../Application"
import BusData from "../../../interfaces/KentKart/object/BusData"
import { useQuery } from "react-query"
import buffer from "buffer"
import Logger from "../../../Logger"
export async function putBusImages(
	bus: BusData,
	image: string | undefined
) {
	if (!image) return
	const file = await fetch(image)
	const img_type = "image/png"//(await file.blob()).type
	if (!img_type) {
		throw Error("File not found")
	}
	if (!img_type.startsWith("image/")) {
		throw Error("File is not an image")
	}
	const img_src = `data:${img_type};base64,`
	const img_data = await file.arrayBuffer()
	console.log(img_data.slice(0, 100))
	const img_base64 = buffer.Buffer.from(img_data)
	const img = img_src + img_base64
	const authToken = await Application.database.get(
		"CDN_TOKEN"
	)

	Logger.info("REQUEST usePutBusImages", bus)
	const url =
		`${Application.fkart_endpoints.bus}/media?busPlateNumber=` + bus.plateNumber
	return axios(url, {
		method: "PUT",
		headers: {
			Authorization: authToken,
			"Content-Type": img_type,
		},
		data: img_base64,
	})
}

export function usePutBusImages(
	bus: BusData,
	image: string | undefined
) {
	return useQuery(["putBusImages",bus.plateNumber,image], () => putBusImages(bus, image))
}