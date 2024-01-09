import { useQuery } from "react-query"
import Application from "../Application"

async function getRouteList({region}:{region:string}) {
	const { data } = await Application.makeRequest(
		`${Application.endpoints.service}/rl1/web/nearest/find?region=${region}`
	)
	return data
}

export default function useGetRouteList({region}:{region:string}) {
	const {data, error,isLoading,refetch,isError,isRefetching} = useQuery(["route_list", region], () => getRouteList({region}), {staleTime:Infinity})
	return {data,error,isLoading,isError,refetch,isRefetching}
}
