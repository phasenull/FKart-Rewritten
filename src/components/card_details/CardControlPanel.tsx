import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Favorite } from "../../common/enums/Favorites"
import { BasicCardData } from "../../common/interfaces/BasicCardData"
import Application from "../../common/Application"
import { Text, TouchableOpacity, View } from "react-native"
import { useEffect, useState } from "react"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useFavoriteCard } from "../../common/hooks/useRenameCard"
import RenameModal from "./RenameModal"
import Logger from "../../common/Logger"
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
	const card = props?.card
	const is_virtual = props?.is_virtual
	const { navigation } = props
	const [favorite, setFavorite] = useState(favorite_data ? true : false)
	const [card_description, setCardDescription] = useState(favorite_data.description)
	const [show_rename_modal, setShowRenameModal] = useState(false)
	const {
		data: request_result,
		error: request_error,
		isError: is_request_error,
		isRefetchError: is_request_refetch_error,
		isLoading: request_loading,
		isRefetching: request_refetching,
		refetch: request_refetch,
	} = useFavoriteCard({
		card_or_fav_id: card.aliasNo,
		name: card_description,
		type: favorite ? "remove" : "add",
	})
	if (!card || !favorite_data) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text style={{ color: styles.warning, fontSize: 24 }}>No card data found</Text>
			</View>
		)
	}
	useEffect(()=>{
		if (["",favorite_data.description].includes(card_description)) {return}
		Logger.log("CardControlPanel","renameing card to "+card_description)
		request_refetch()
	},[card_description])
	return (
		<View className="w-80 flex-col h-max px-4 pb-4 rounded-[16px] gap-y-4 my-5" style={{ elevation: 10, backgroundColor: styles.dark }}>
			<RenameModal
				visible={show_rename_modal}
				onDismiss={() => {
					setShowRenameModal(false)
				}}
				onSave={(text) => {
					setCardDescription(text)
					setShowRenameModal(false)
				}}
			/>
			<Text className="text-black">
				{(request_error as any)?.message}
			</Text>
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
						request_refetch()
						setFavorite(!favorite)
					}}
					className="flex-1 rounded-xl flex-row justify-center items-center h-12"
					style={{ backgroundColor: favorite ? styles.warning : styles.white }}
				>
					<Text
						className="text-center"
						style={{
							fontWeight: "600",
							color: styles.secondary,
							fontSize: 15,
						}}
					>
						{favorite ? "Remove" : "Add"}
					</Text>
					<MaterialCommunityIcons name="delete" size={24} color={styles.secondary} />
				</TouchableOpacity>
			</View>
		</View>
	)
}
