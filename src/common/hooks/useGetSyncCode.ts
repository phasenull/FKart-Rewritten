import { useQuery } from "react-query"
import Application from "../Application"
import { AxiosResponse } from "axios"
import { BaseKentKartResponse } from "../enums/BasicKentKartResponse"
import Logger from "../Logger"

async function getSyncCode(card_alias: string | undefined): Promise<
	| AxiosResponse<
			BaseKentKartResponse & {
				cardInfo: {
					expireDate: string
					token: string
					aliasNo: string
				}
			}
	  >
	| undefined
> {
	if (!card_alias) {
		return
	}
	Logger.info("REQUEST useGetSyncCode")
	const url = `https://service.kentkart.com/rl1/api/abt/sync?alias=${card_alias}&region=${Application.region}&authType=4`
	return Application.makeRequest(url)
}

export function useGetSyncCode(card_alias: string | undefined) {
	return useQuery(["syncCode", card_alias], () => getSyncCode(card_alias), { staleTime: 1000, refetchInterval: Application.sync_interval, refetchIntervalInBackground: true })
}
