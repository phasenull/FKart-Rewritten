import { useQuery } from "react-query"
import Application from "../Application"
import { BasicKentKartResponse } from "../enums/BasicKentKartResponse"
import { BasicCardData } from "../interfaces/BasicCardData"
import { AxiosResponse } from "axios"

async function getCardData(
	card_alias: string
): Promise<
	AxiosResponse<BasicKentKartResponse & {cardlist: BasicCardData<any>[]}>
> {
	const url = `${Application.endpoints.service}/rl1/api/card/balance?region=${Application.region}&lang=tr&authType=4&token=${Application.logged_user?.access_token}&alias=${card_alias}`
	return Application.makeRequest(url)
}

export function useGetCardData(card_alias: string) {
	return useQuery(
		["getCardData", card_alias],
		() => getCardData(card_alias),
		{ staleTime: 0, refetchInterval: 10000 }
	)
}
