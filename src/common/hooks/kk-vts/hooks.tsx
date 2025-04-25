/* 
	This mentioned project is also a failure due to couple reasons i wont mention
	hopefully some part of GC will be running this (that part will hopefully be its successor so this project wont go to waste)

	see more @ https://github.com/phasenull/kentkart-vts-observer

*/

import ApplicationConfig from "common/ApplicationConfig";
import { router } from "expo-router";
import { useInfiniteQuery, useQuery } from "react-query";


/* NO REGION CONFIGURATION CONSIDERING HOW EXPENSIVE HOSTING 1 REGION IS
*/

export function useGetVTSKeys() {
	return useInfiniteQuery(["vts-page"], {
		getNextPageParam: async (a, b) => {
			return b.length + 1
		},
		queryFn: async (c) => {
			const page = await c.pageParam || 0
			console.log("page", page)
			const API = await ApplicationConfig.database.get("kk_vts_api")
			const url = `${API}/api/vts/list?page=${page}&limit=100`
			if (!API) router.navigate({ pathname: "/AppData", params: { fill_key: "kk_vts_api" } })
			const response = await fetch(url)
			const json = await response.json()
			return json
		}
	})
}

export function useSearchBus(search_string: string) {
	return useInfiniteQuery(["search-bus",search_string], {
		queryFn: async (c) => {
			const page = await c.pageParam
			search_string = (search_string.replaceAll(".", "").replaceAll("/", ""))
			const API = await ApplicationConfig.database.get("kk_vts_api")
			const url = `${API}/api/vehicles/search/${search_string}?page=${page}`
			if (!API) router.navigate({ pathname: "/AppData", params: { fill_key: "kk_vts_api" } })
			const response = await fetch(url)
			const json = await response.json()
			return json
		},
		getNextPageParam: async (a, b) => {
			const logic = (a.data?.length >= 5) ? b.length : undefined
			console.log("returning next page param",logic)
			return logic
		},
		
		cacheTime: 10*60*1000,
		staleTime: 0,

	})
}

export function useGetLatestBusInfo(bus_id: string) {
	return useQuery(["search-bus", bus_id], {
		queryFn: async (c) => {

			bus_id = (bus_id.replaceAll(".", "").replaceAll("/", ""))
			const API = await ApplicationConfig.database.get("kk_vts_api")
			const url = `${API}/api/vehicles/${bus_id}/history`
			if (!API) router.navigate({ pathname: "/AppData", params: { fill_key: "kk_vts_api" } })
			const response = await fetch(url)
			const json = await response.json()
			return json
		}
	})
}