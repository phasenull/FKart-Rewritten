import { useQuery } from "react-query"
import ApplicationConfig from "common/ApplicationConfig"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import { BasicCardData } from "common/interfaces/KentKart/BasicCardData"
import { AxiosResponse } from "axios"
import Logger from "common/Logger"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import CardTransaction from "common/interfaces/KentKart/CardTransaction"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"

export function useGetCardData(args: { card_alias: string }) {
	const user = useKentKartAuthStore((state) => state.user) as IKentKartUser
	return useQuery(
		["getCardData", args.card_alias],
		(): Promise<AxiosResponse<BaseKentKartResponse & { cardlist: BasicCardData<any>[] }>> => {
			const { card_alias } = args
			Logger.info(`REQUEST useGetCardData ${card_alias}`)
			const url = `${ApplicationConfig.endpoints.service}/rl1/api/card/balance?region=${ApplicationConfig.region}&lang=tr&authType=4&token=${user?.access_token}&alias=${card_alias}`
			return ApplicationConfig.makeKentKartRequest(url)
		},
		{ staleTime: 30_000, refetchInterval: 60_000, refetchIntervalInBackground: false }
	)
}

export function useGetABTSecret(args: { card_alias: string }) {
	const user = useKentKartAuthStore((state) => state.user) as IKentKartUser
	return useQuery(
		["syncCode", args.card_alias],
		(): Promise<
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
		> => {
			const { card_alias } = args
			Logger.info("REQUEST useGetSyncCode")
			const url = `https://service.kentkart.com/rl1/api/abt/sync?alias=${card_alias}&region=${ApplicationConfig.region}&authType=4&token=${user.access_token}`
			return ApplicationConfig.makeKentKartRequest(url)
		},
		{ staleTime: 20 * 1000, refetchInterval: ApplicationConfig.sync_interval, refetchIntervalInBackground: true }
	)
}

export function useGetTransactions(args: { card_alias: string; term: { month: number; year: number } }) {
	const { card_alias, term } = args
	const user = useKentKartAuthStore((state) => state.user) as IKentKartUser
	return useQuery(
		["getCardData", card_alias, term],
		(): Promise<AxiosResponse<BaseKentKartResponse & { transactionList: CardTransaction<any>[] }>> => {
			Logger.info(`REQUEST useGetCardData ${card_alias}`)
			const stringified_month = term.month.toString().padStart(2, "0")
			const stringified_year = term.year.toString()
			const final_date = `${stringified_year}${stringified_month}`
			const url = `${ApplicationConfig.endpoints.service}/rl1/api/card/transaction?region=${ApplicationConfig.region}&lang=tr&authType=4&token=${user?.access_token}&alias=${card_alias}&term=${final_date}`
			return ApplicationConfig.makeKentKartRequest(url)
		},
		{ staleTime: Infinity }
	)
}

async function FavoriteCardAsync(args: { card_or_fav_id: string; name: string | undefined; type: "add" | "remove"; user: IKentKartUser }) {
	const { card_or_fav_id, name, type, user } = args
	if (!name || !card_or_fav_id) {
		return
	}
	Logger.info("REQUEST FavoriteCard", card_or_fav_id, name)

	return ApplicationConfig.makeKentKartRequest(
		`${ApplicationConfig.endpoints.service}/rl1/api/v3.0/favorite?region=${ApplicationConfig.region}&authType=4&favorite=${card_or_fav_id}&description=${name || "HATALI AD"}&type=2&token=${
			user?.access_token
		}`,
		{
			method: type === "remove" ? "DELETE" : "POST",
		}
	)
}

export function useAddFavoriteCard(args: { card_or_fav_id: string; name: string | undefined }) {
	return useQuery(
		["PostFavoriteCard", args.card_or_fav_id, args.name, "add", Date.now()],
		() => {
			const user = useKentKartAuthStore((state) => state.user) as IKentKartUser
			return FavoriteCardAsync({
				...args,
				type: "add",
				user: user,
			})
		},
		{ staleTime: 0, enabled: false }
	)
}
export function useRemoveFavoriteCard(args: { card_or_fav_id: string }) {
	return useQuery(
		["DeleteFavoriteCard", args.card_or_fav_id, "remove", Date.now()],
		() => {
			const user = useKentKartAuthStore((state) => state.user) as IKentKartUser
			return FavoriteCardAsync({
				...args,
				type: "remove",
				name: "",
				user: user,
			})
		},
		{ staleTime: 0, enabled: false }
	)
}
