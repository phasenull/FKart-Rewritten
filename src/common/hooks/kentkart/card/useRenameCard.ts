import { useQuery } from "react-query"
import ApplicationConfig from "common/ApplicationConfig"
import Logger from "common/Logger"

async function FavoriteCard(card_or_fav_id: string, name: string | undefined, type: "add" | "remove") {
	if (!name || !card_or_fav_id) {
		return
	}
	Logger.info("REQUEST FavoriteCard", card_or_fav_id, name)

	return ApplicationConfig.makeKentKartRequest(
		`${ApplicationConfig.endpoints.service}/rl1/api/v3.0/favorite?region=${ApplicationConfig.region}&authType=4&favorite=${card_or_fav_id}&description=${name || "HATALI AD"}&type=2`,
		{
			method: type === "remove" ? "DELETE" : "POST",
		}
	)
}

export function useAddFavoriteCard({ card_or_fav_id, name }: { card_or_fav_id: string; name: string | undefined }) {
	return useQuery(["PostFavoriteCard", card_or_fav_id, name, "add"], () => FavoriteCard(card_or_fav_id, name, "add"), { staleTime: 0, enabled: false })
}
export function useRemoveFavoriteCard({ card_or_fav_id }: { card_or_fav_id: string }) {
	return useQuery(["DeleteFavoriteCard", card_or_fav_id, "remove"], () => FavoriteCard(card_or_fav_id, "hello world", "remove"), { staleTime: 0, enabled: false })
}
