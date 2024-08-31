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
import { router, useLocalSearchParams } from "expo-router"
export default function CardControlPanel(props: {
	card: BasicCardData<"Basic" | "QR">
	is_virtual?: boolean
	makeRefresh: () => void
}) {
	const { theme } = useContext(ThemeContext)
	const [loading, setLoading] = useState(false)
	const is_virtual = props?.is_virtual
	const {description, alias} = useLocalSearchParams() as any
	const [favorite, setFavorite] = useState(!!description)
	const [show_rename_modal, setShowRenameModal] = useState(false)
	const user = useKentKartAuthStore((state) => state.user)
	const { data: dataAdd, isLoading: isLoadingAdd, mutateAsync: mutateAdd } = useAddFavoriteCard()
	const { data: dataRemove, isLoading: isLoadingRemove, mutate: mutateRemove } = useRemoveFavoriteCard()

	if (!alias) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text style={{ color: theme.error, fontSize: 24 }}>Card no is not valid!</Text>
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
				defaultValue={description}
				onSave={(text) => {
					setShowRenameModal(false)
					setFavorite(true)
					if (!text || ["", undefined, description].includes(text)) {
						console.log("abort card rename")
						return
					}
					console.log("attempt to change card name to",alias,text)
					mutateAdd({ alias_no: alias, name: text }).then((e) => {
						console.log("rename result",e?.data)
						router.setParams({
							description: text || (is_virtual && "QR Kart") || "unnamed card",
						})
					}).catch((e)=>Logger.warning("CardControlPanel.tsx/mutateAdd",e))
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
							mutateRemove({ alias_no: alias })
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
