import { useQuery } from "react-query"
import Application from "common/Application"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import { BasicCardData } from "common/interfaces/KentKart/BasicCardData"
import { AxiosResponse } from "axios"

async function getCardTransactions(card_alias: string, term: string): Promise<AxiosResponse<BaseKentKartResponse & {}>> {
	// Logger.info(`REQUEST useGetCardData ${card_alias}`)
	const url = `${Application.endpoints.service}/rl1/api/card/transaction?region=${Application.region}&lang=tr&authType=4&token=${Application.logged_user?.access_token}&alias=${card_alias}&term=${term}`
	return Application.makeKentKartRequest(url)
}

export function useGetTransactions(card_alias: string, term: { month: number; year: number }) {
	const stringified_month = term.month.toString().padStart(2, "0")
	const stringified_year = term.year.toString()
	const final_date = `${stringified_year}${stringified_month}`
	return useQuery(["getCardData", card_alias, term], () => getCardTransactions(card_alias, final_date), { staleTime: Infinity })
}
