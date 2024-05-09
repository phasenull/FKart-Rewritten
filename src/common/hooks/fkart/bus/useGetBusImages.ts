import axios from "axios"
import Application from "../../../Application"
import BusData from "../../../interfaces/KentKart/BusData"
import { useQuery } from "react-query"
import Logger from "../../../Logger"

async function getBusImages(bus: BusData) {
	Logger.info(`REQUEST useGetBusImages ${bus.plateNumber}`)
	const authToken = await Application.database.get(
		"CDN_TOKEN"
	)
	const url =
		`${Application.fkart_endpoints.bus}/media?busPlateNumber=` + bus.plateNumber
	return axios(url, {
		method: "GET",
		headers: {
			Authorization: authToken,
		},
	})
}

export function useGetBusImages(bus: BusData) {
	return useQuery(["getBusImages",bus.plateNumber], () => getBusImages(bus),{staleTime: Infinity, cacheTime: 24*60*1000})
}
