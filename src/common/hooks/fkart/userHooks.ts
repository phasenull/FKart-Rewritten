import { useFKartAuthStore } from "common/stores/FKartAuthStore"
import { useQuery } from "react-query"

export function useGetAccessToken() {
	const fetchAccessToken = useFKartAuthStore((state)=>state.fetchAccessToken)
	return useQuery({
		queryFn: async () => {
			const [token,error] = await fetchAccessToken()
			if (error) {
				throw new Error(`Couldn't fetch access token: ${error}`)
			}
			return token
		},
		queryKey: ["fkart.access_token"],
		refetchInterval: 3 * 60 * 1_000,
		refetchIntervalInBackground: true,
		staleTime: 2.9 * 60 * 1_000,
		cacheTime: Infinity,
	})
}
