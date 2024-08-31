import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Favorite, FavoritesV3Card } from "common/interfaces/KentKart/Favorite"
import { BasicCardData } from "common/interfaces/KentKart/BasicCardData"
import { Text, TouchableOpacity, View } from "react-native"
import { useContext, useEffect, useMemo, useState } from "react"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useAddFavoriteCard, useRemoveFavoriteCard } from "common/hooks/kentkart/cardHooks"
import InputModal from "components/reusables/InputModal"
import Logger from "common/Logger"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
export default function CardControlPanel(props: {
	card: BasicCardData<"Basic" | "QR">
	favorite_data: FavoritesV3Card
	is_virtual?: boolean
	navigation: NativeStackNavigationProp<any>
	makeRefresh: () => void
}) {
	const { theme } = useContext(ThemeContext)
	const [loading, setLoading] = useState(false)
	const favorite_data = props?.favorite_data
	const [card, setCard] = useState(props?.card)
	const is_virtual = props?.is_virtual
	const { navigation } = props
	const [favorite, setFavorite] = useState(favorite_data ? true : false)
	const [card_description, setCardDescription] = useState<string | undefined>(undefined)
	const [show_rename_modal, setShowRenameModal] = useState(false)
	const user = useKentKartAuthStore((state) => state.user)
	const { data: dataAdd, isLoading: isLoadingAdd, mutateAsync: mutateAdd } = useAddFavoriteCard()
	const { data: dataRemove, isLoading: isLoadingRemove, mutate: mutateRemove } = useRemoveFavoriteCard()

	useEffect(() => {
		navigation.setOptions({
			headerTitle: favorite_data.description || (is_virtual && "QR Kart") || "unnamed card",
		})
	}, [])

	if (!card || !favorite_data) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text style={{ color: theme.error, fontSize: 24 }}>No card data found</Text>
			</View>
		)
	}
	return (
		<View className="w-80 flex-col h-max px-4 pb-4 rounded-[16px] gap-y-4" style={{ elevation: 2, backgroundColor: theme.white }}>
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
					mutateAdd({ alias_no: card.aliasNo, name: text }).then((e) => {
						navigation.setOptions({
							headerTitle: text || (is_virtual && "QR Kart") || "unnamed card",
						})
					})
				}}
			/>
			<Text style={{ color: theme.primaryDark, fontSize: 24, fontWeight: "600" }}>Quick Actions</Text>
			<View className="flex-row gap-x-4">
				<TouchableOpacity className="flex-1 rounded-xl flex-row justify-center items-center h-12" style={{ backgroundColor: theme.primaryDark }}>
					<Text
						className="text-center"
						style={{
							fontWeight: "600",
							color: theme.secondary,
							fontSize: 15,
						}}
					>
						Records
					</Text>
					<MaterialCommunityIcons name="file-document" size={24} color={theme.secondary} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setShowRenameModal((previous) => !previous)
					}}
					className="flex-1 rounded-xl flex-row justify-center items-center h-12"
					style={{ backgroundColor: theme.primaryDark }}
				>
					<Text
						className="text-center"
						style={{
							fontWeight: "600",
							color: theme.secondary,
							fontSize: 15,
						}}
					>
						Change Name
					</Text>
					<MaterialCommunityIcons name="pencil" size={24} color={theme.secondary} />
				</TouchableOpacity>
			</View>
			<View className="flex-row gap-x-4">
				<TouchableOpacity className="flex-1 rounded-xl flex-row justify-center items-center h-12" style={{ backgroundColor: theme.success }}>
					<Text
						className="text-center"
						style={{
							fontWeight: "600",
							color: theme.secondary,
							fontSize: 15,
						}}
					>
						Load
					</Text>
					<MaterialCommunityIcons name="cash-plus" size={24} color={theme.secondary} />
				</TouchableOpacity>
				<TouchableOpacity
					disabled={!user}
					onPress={() => {
						if (favorite) {
							mutateRemove({ alias_no: card.aliasNo })
						} else {
							setShowRenameModal(true)
						}
					}}
					className="flex-1 rounded-xl flex-row justify-center items-center h-12"
					style={{ backgroundColor: favorite ? theme.error : theme.primaryDark }}
				>
					<Text
						className="text-center"
						style={{
							fontWeight: "600",
							color: theme.secondary,
							fontSize: 15,
						}}
					>
						{favorite ? "Remove" : "Favorite"}
					</Text>
					<MaterialCommunityIcons name={favorite ? "delete" : "star"} size={24} color={theme.secondary} />
				</TouchableOpacity>
			</View>
		</View>
	)
}
