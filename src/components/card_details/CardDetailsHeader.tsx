import { LinearGradient } from "expo-linear-gradient"
import { useContext, useMemo } from "react"
import { View, TouchableOpacity, ToastAndroid, Vibration, Text, Clipboard, Image } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { BasicCardData } from "common/interfaces/KentKart/BasicCardData"
import CardTypes from "common/enums/CardTypes"
import CardImages from "common/enums/CardImages"
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated"
import { ThemeContext } from "common/contexts/ThemeContext"
import { FavoritesV3Card } from "common/interfaces/KentKart/Favorite"

export default function CardDetailsHeader(props: { card:BasicCardData<any>; card_type: CardTypes; setShowEditCardTypeModal: (value: boolean) => void }) {
	const { card, card_type, setShowEditCardTypeModal } = props
	const { theme } = useContext(ThemeContext)
	return (
		<LinearGradient colors={[theme.primary, theme.white]} end={{ x: 0.8, y: 0.9 }} className="flex-row h-56 w-full mb-20" style={{ backgroundColor: theme.primary }}>
			<Animated.View className="flex-col flex-1 ml-5 self-end mb-4 " entering={FadeInLeft.duration(500)}>
				<Text className="opacity-70 top-3 text-white text-xl">Bakiye</Text>
				<View className="flex-row items-baseline text-white gap-x-2 mb-4">
					<Text className="font-bold text-white text-[48px]" numberOfLines={1} adjustsFontSizeToFit={true}>
						{card.balance}
					</Text>
					<Text className="text-[28px] text-white font-bold">TL</Text>
				</View>
				<TouchableOpacity
					onPress={() => {
						Clipboard.setString(card.aliasNo)
						ToastAndroid.show("Kart numarası kopyalandı!", ToastAndroid.SHORT)
						Vibration.vibrate(100)
					}}
					onLongPress={() => {
						Clipboard.setString(card.aliasNo)
						ToastAndroid.show("Kart numarası kopyalandı!", ToastAndroid.SHORT)
						Vibration.vibrate(100)
					}}
					className="flex-row w-full gap-x-1 items-center"
				>
					<View className="flex-col">
						<Text className="opacity-70 text-white text-xl">Kart Numarası</Text>
						<Text className="font-bold bottom-1 text-white text-xl">{card.aliasNo}</Text>
					</View>
					<MaterialCommunityIcons style={{ color: theme.white }} size={20} name="content-copy" />
				</TouchableOpacity>
			</Animated.View>
			<Animated.View entering={FadeInDown.duration(500)} className="flex-1 mr-24">
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
					{card_type === "QR" ? null : <MaterialCommunityIcons style={{ bottom: 16 * 4, right: 4 * 4, alignSelf: "flex-end" }} color={theme.dark} name="image-edit" size={36} />}
				</TouchableOpacity>
			</Animated.View>
		</LinearGradient>
	)
}
