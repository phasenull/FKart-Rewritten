import { useQuery } from "react-query"
import Application from "../../../Application"
import { BaseKentKartResponse } from "../../../interfaces/KentKart/BaseKentKartResponse"
import { BasicCardData } from "../../../interfaces/KentKart/BasicCardData"
import { AxiosResponse } from "axios"

async function getCardTransactions(
	card_alias: string,term:string
): Promise<
	AxiosResponse<BaseKentKartResponse & {}>
> {
	// Logger.info(`REQUEST useGetCardData ${card_alias}`)
	const url = `${Application.endpoints.service}/rl1/api/card/transaction?region=${Application.region}&lang=tr&authType=4&token=${Application.logged_user?.access_token}&alias=${card_alias}&term=${term}`
	return Application.makeKentKartRequest(url)
}

export function useGetTransactions(card_alias: string,term:string) {
	return useQuery(
		["getCardData", card_alias,term],
		() => getCardTransactions(card_alias,term),
		{ staleTime: Infinity }
	)
}
