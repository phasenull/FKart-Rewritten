import axios from "axios"
import Application from "../Application"
import BusData from "../interfaces/BusData"
import { useQuery } from "react-query"

async function getBusImages(bus: BusData) {
	const authToken = await Application.database.get(
		"CDN_TOKEN"
	)
	const url =
		`${Application.fkart_endpoints.bus}/media?busPlateNumber=` + bus.plateNumber
	const request = axios(url, {
		method: "GET",
		headers: {
			Authorization: authToken,
		},
	})
	return request
}

export function useGetBusImages(bus: BusData) {
	const {
		data,
		error,
		isLoading,
		refetch,
		isError,
		isRefetching,
	} = useQuery(["getBusImages",bus.plateNumber], () => getBusImages(bus))
	return {
		data,
		error,
		isLoading,
		refetch,
		isError,
		isRefetching,
	}
}
