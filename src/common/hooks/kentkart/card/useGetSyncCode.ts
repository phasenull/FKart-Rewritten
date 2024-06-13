import { useQuery } from "react-query"
import ApplicationConfig from "common/ApplicationConfig"
import { AxiosResponse } from "axios"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import Logger from "common/Logger"

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
	const url = `https://service.kentkart.com/rl1/api/abt/sync?alias=${card_alias}&region=${ApplicationConfig.region}&authType=4`
	return ApplicationConfig.makeKentKartRequest(url)
}

export function useGetSyncCode(card_alias: string | undefined) {
	return useQuery(["syncCode", card_alias], () => getSyncCode(card_alias), { staleTime: 20*1000, refetchInterval: ApplicationConfig.sync_interval, refetchIntervalInBackground: true })
}
