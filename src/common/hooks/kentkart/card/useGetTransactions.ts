import { useQuery } from "react-query"
import ApplicationConfig from "common/ApplicationConfig"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import { BasicCardData } from "common/interfaces/KentKart/BasicCardData"
import { AxiosResponse } from "axios"
import CardTransaction from "common/interfaces/KentKart/CardTransaction"

async function getCardTransactions(card_alias: string, term: string): Promise<AxiosResponse<BaseKentKartResponse & {transactionList:CardTransaction<any>[]}>> {
	// Logger.info(`REQUEST useGetCardData ${card_alias}`)
	const url = `${ApplicationConfig.endpoints.service}/rl1/api/card/transaction?region=${ApplicationConfig.region}&lang=tr&authType=4&token=${ApplicationConfig.logged_user?.access_token}&alias=${card_alias}&term=${term}`
	return ApplicationConfig.makeKentKartRequest(url)
}

export function useGetTransactions(card_alias: string, term: { month: number; year: number }) {
	const stringified_month = term.month.toString().padStart(2, "0")
	const stringified_year = term.year.toString()
	const final_date = `${stringified_year}${stringified_month}`
	return useQuery(["getCardData", card_alias, term], () => getCardTransactions(card_alias, final_date), { staleTime: Infinity })
}
