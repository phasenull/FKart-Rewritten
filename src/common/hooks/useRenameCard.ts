import { useQuery } from "react-query"
import Application from "../Application"

async function FavoriteCard(card_or_fav_id: string, name: string, type: "add" | "remove") {
	return Application.makeRequest(`${Application.endpoints.service}/rl1/api/v3.0/favorite?region=${Application.region}&authType=4&favorite=${card_or_fav_id}&description=${name || "HATALI AD"}&type=2`, {
		method: (type === "remove") ? "DELETE" : "POST",
	})
}

export function useAddFavoriteCard({card_or_fav_id,name}:{card_or_fav_id: string, name: string}) {
	return useQuery(["PostFavoriteCard", card_or_fav_id, name,"add"], () => FavoriteCard(card_or_fav_id, name, "add"), { staleTime: 0, enabled: false })
}
export function useRemoveFavoriteCard({card_or_fav_id}:{card_or_fav_id: string}) {
	return useQuery(["DeleteFavoriteCard", card_or_fav_id,"remove"], () => FavoriteCard(card_or_fav_id, "", "remove"), { staleTime: 0, enabled: false })
}


