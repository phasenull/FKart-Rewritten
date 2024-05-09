import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Favorite } from "../../../common/interfaces/KentKart/object/Favorite" 
import { BasicCardData } from "../../../common/interfaces/KentKart/object/BasicCardData"
import Application from "../../../common/Application"
import { Text, TouchableOpacity, View } from "react-native"
import { useEffect, useMemo, useState } from "react"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useAddFavoriteCard, useRemoveFavoriteCard } from "../../../common/hooks/kentkart/user/useRenameCard"
import InputModal from "../../root/InputModal"
import Logger from "../../../common/Logger"
import useGetFavorites from "../../../common/hooks/kentkart/user/useGetFavorites"
export default function CardControlPanel(props: {
	card: BasicCardData<"Basic" | "QR">
	favorite_data: Favorite<"Card" | "QR">
	is_virtual?: boolean
	navigation: NativeStackNavigationProp<any>
	makeRefresh: () => void
}) {
	const styles = Application.styles
	const [loading, setLoading] = useState(false)
	const favorite_data = props?.favorite_data
	const [card, setCard] = useState(props?.card)
	const is_virtual = props?.is_virtual
	const { navigation } = props
	const [favorite, setFavorite] = useState(favorite_data ? true : false)
	const [card_description, setCardDescription] = useState<string | undefined>(undefined)
	const [show_rename_modal, setShowRenameModal] = useState(false)
	const {
		data: request_result,
		error: request_error,
		isError: is_request_error,
		isRefetchError: is_request_refetch_error,
		isLoading: request_loading,
		isRefetching: request_refetching,
		refetch: refetchAddCard,
	} = useAddFavoriteCard({
		card_or_fav_id: card.aliasNo,
		name: card_description,
	})
	const { refetch: refetchRemoveCard, data: dataRemoveCard } = useRemoveFavoriteCard({
		card_or_fav_id: card.aliasNo,
	})
	useEffect(() => {
		// console.log("favoriteData",favoriteData?.data?.userFavorites,card.aliasNo)
		if (favorite_data) {
			setFavorite(true)
		} else {
			setFavorite(false)
		}
	}, [])
	useEffect(() => {
		navigation.setOptions({
			headerTitle: favorite_data.description || (is_virtual && "QR Kart") || "unnamed card",
		})
	}, [])

	useEffect(() => {
		if (["", undefined].includes(card_description)) {
			return
		}
		navigation.setOptions({
			headerTitle: card_description || (is_virtual && "QR Kart") || "unnamed card",
		})
		Logger.log("CardControlPanel", "renameing card to " + card_description)
		refetchAddCard()
	}, [card_description])
	if (!card || !favorite_data) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text style={{ color: styles.error, fontSize: 24 }}>No card data found</Text>
			</View>
		)
	}
	return useMemo(() => {
		console.log("card_control_panel render")
		return (
			<View className="w-80 flex-col h-max px-4 pb-4 rounded-[16px] gap-y-4" style={{ elevation: 2, backgroundColor: styles.white }}>
				<InputModal
					visible={show_rename_modal}
					onDismiss={() => {
						setShowRenameModal(false)
					}}
					defaultValue={card_description || favorite_data.description}
					onSave={(text) => {
						setShowRenameModal(false)
						setFavorite(true)
						if (!text || ["", undefined, card_description].includes(text)) {
							return
						}
						setCardDescription(text)
					}}
				/>
				<Text style={{ color: Application.styles.primaryDark, fontSize: 24, fontWeight: "600" }}>Quick Actions</Text>
				<View className="flex-row gap-x-4">
					<TouchableOpacity className="flex-1 rounded-xl flex-row justify-center items-center h-12" style={{ backgroundColor: styles.primaryDark }}>
						<Text
							className="text-center"
							style={{
								fontWeight: "600",
								color: styles.secondary,
								fontSize: 15,
							}}
						>
							Records
						</Text>
						<MaterialCommunityIcons name="file-document" size={24} color={styles.secondary} />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							setShowRenameModal(true)
						}}
						className="flex-1 rounded-xl flex-row justify-center items-center h-12"
						style={{ backgroundColor: styles.primaryDark }}
					>
						<Text
							className="text-center"
							style={{
								fontWeight: "600",
								color: styles.secondary,
								fontSize: 15,
							}}
						>
							Change Name
						</Text>
						<MaterialCommunityIcons name="pencil" size={24} color={styles.secondary} />
					</TouchableOpacity>
				</View>
				<View className="flex-row gap-x-4">
					<TouchableOpacity className="flex-1 rounded-xl flex-row justify-center items-center h-12" style={{ backgroundColor: styles.success }}>
						<Text
							className="text-center"
							style={{
								fontWeight: "600",
								color: styles.secondary,
								fontSize: 15,
							}}
						>
							Load
						</Text>
						<MaterialCommunityIcons name="cash-plus" size={24} color={styles.secondary} />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							if (favorite) {
								refetchRemoveCard()
								setFavorite(false)
							} else {
								setShowRenameModal(true)
							}
						}}
						className="flex-1 rounded-xl flex-row justify-center items-center h-12"
						style={{ backgroundColor: favorite ? styles.error : styles.primaryDark }}
					>
						<Text
							className="text-center"
							style={{
								fontWeight: "600",
								color: styles.secondary,
								fontSize: 15,
							}}
						>
							{favorite ? "Remove" : "Favorite"}
						</Text>
						<MaterialCommunityIcons name={favorite ? "delete" : "star"} size={24} color={styles.secondary} />
					</TouchableOpacity>
				</View>
			</View>
		)
	}, [card_description, favorite, show_rename_modal])
}
