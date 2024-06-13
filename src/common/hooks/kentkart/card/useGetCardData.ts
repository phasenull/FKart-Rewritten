import { useQuery } from "react-query"
import ApplicationConfig from "common/ApplicationConfig"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import { BasicCardData } from "common/interfaces/KentKart/BasicCardData"
import { AxiosResponse } from "axios"
import Logger from "common/Logger"

async function getCardData(
	card_alias: string
): Promise<
	AxiosResponse<BaseKentKartResponse & {cardlist: BasicCardData<any>[]}>
> {
	// Logger.info(`REQUEST useGetCardData ${card_alias}`)
	const url = `${ApplicationConfig.endpoints.service}/rl1/api/card/balance?region=${ApplicationConfig.region}&lang=tr&authType=4&token=${ApplicationConfig.logged_user?.access_token}&alias=${card_alias}`
	return ApplicationConfig.makeKentKartRequest(url)
}

export function useGetCardData(card_alias: string) {
	return useQuery(
		["getCardData", card_alias],
		() => getCardData(card_alias),
		{ staleTime: 30_000,refetchInterval: 30_000,refetchIntervalInBackground: false }
	)
}
