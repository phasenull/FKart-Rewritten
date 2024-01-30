import { LinearGradient } from "expo-linear-gradient"
import { useMemo } from "react"
import { View, TouchableOpacity, ToastAndroid, Vibration, Text, Clipboard, Image } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Application from "../../common/Application"
import { BasicCardData } from "../../common/interfaces/BasicCardData"
import CardTypes from "../../common/enums/CardTypes"
import CardImages from "../../common/enums/CardImages"

export default function CardDetailsHeader(props: {
	card: BasicCardData<"Basic" | "QR">
	card_type: CardTypes
	setShowEditCardTypeModal: (value: boolean) => void
}) {
	const { card, card_type, setShowEditCardTypeModal } = props
	const styles = Application.styles
	return useMemo(() => {
		console.log("card_details_header render")
		return (
			<LinearGradient colors={[styles.primary, styles.white]} end={{ x: 0.8, y: 0.9 }} className="flex-row h-56 w-full mb-20" style={{ backgroundColor: styles.primary }}>
				<View className="flex-col flex-1 ml-5 self-end mb-4 ">
					<Text className="opacity-70 top-3 text-white text-xl">Bakiye</Text>
					<View className="flex-row items-baseline text-white gap-x-2 mb-4">
						<Text className="font-bold text-white text-[48px]">{card.balance}</Text>
						<Text className="text-[28px] text-white font-bold">TL</Text>
					</View>
					<TouchableOpacity
						onPress={() => {
							Clipboard.setString(card.aliasNo)
							ToastAndroid.show("Kart numarası kopyalandı!", ToastAndroid.SHORT)
							// vibrate device
							Vibration.vibrate(100)
						}}
						onLongPress={() => {
							Clipboard.setString(card.aliasNo)
							ToastAndroid.show("Kart numarası kopyalandı!", ToastAndroid.SHORT)
							// vibrate device
							Vibration.vibrate(100)
						}}
						className="flex-row w-full gap-x-1 items-center"
					>
						<View className="flex-col">
							<Text className="opacity-70 text-white text-xl">Kart Numarası</Text>
							<Text className="font-bold bottom-1 text-white text-xl">{card.aliasNo}</Text>
						</View>
						<MaterialCommunityIcons style={{ color: styles.white }} size={20} name="content-copy" />
					</TouchableOpacity>
				</View>
				<View className="flex-1 mr-24">
					<TouchableOpacity disabled={card_type === "QR"} onPress={() => setShowEditCardTypeModal(true)} className="relative w-40 h-64 left-16 -bottom-8 ">
						<Image
							className={"w-64 h-64 right-14"}
							style={{
								transform: [{ rotateZ: "90deg" }],
								objectFit: "contain",
							}}
							source={{
								uri: CardImages[card_type],
							}}
						/>
						{card_type === "QR" ? null : <MaterialCommunityIcons style={{ bottom: 16 * 4, right: 4 * 4, alignSelf: "flex-end" }} color={styles.dark} name="image-edit" size={36} />}
					</TouchableOpacity>
				</View>
			</LinearGradient>
		)
	},[card,card_type])
}
