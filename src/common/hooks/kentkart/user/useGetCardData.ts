import { useQuery } from "react-query"
import Application from "../../../Application"
import { BaseKentKartResponse } from "../../../interfaces/KentKart/BasicKentKartResponse"
import { BasicCardData } from "../../../interfaces/KentKart/object/BasicCardData"
import { AxiosResponse } from "axios"
import Logger from "../../../Logger"

async function getCardData(
	card_alias: string
): Promise<
	AxiosResponse<BaseKentKartResponse & {cardlist: BasicCardData<any>[]}>
> {
	// Logger.info(`REQUEST useGetCardData ${card_alias}`)
	const url = `${Application.endpoints.service}/rl1/api/card/balance?region=${Application.region}&lang=tr&authType=4&token=${Application.logged_user?.access_token}&alias=${card_alias}`
	return Application.makeKentKartRequest(url)
}

export function useGetCardData(card_alias: string) {
	return useQuery(
		["getCardData", card_alias],
		() => getCardData(card_alias),
		{ staleTime: 30_000,refetchInterval: 30_000,refetchIntervalInBackground: false }
	)
}