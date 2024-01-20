import Card from "../../common/classes/Card"
import { Text, ToastAndroid, TouchableOpacity, Vibration, View, ViewStyle } from "react-native"
import Animated, { FadeInRight } from "react-native-reanimated"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Application from "../../common/Application"
import { Clipboard } from "react-native"
import { getQRCode } from "../../common/hooks/useGetQRCode"
import { Favorite } from "../../common/enums/Favorites"
import { useGetCardData } from "../../common/hooks/useGetCardData"
import { BasicCardData } from "../../common/interfaces/BasicCardData"
import { useEffect, useState } from "react"
import CustomLoadingIndicator from "../CustomLoadingIndicator"
import CardImages from "../../common/enums/CardImages"
export default function CardContainer(props: { favorite_data: Favorite<"Card" | "QR">; index: number; navigation: any; style?: ViewStyle }) {
	const { favorite_data, index, navigation } = props

	const { data, isLoading, isRefetching, isError } = useGetCardData(favorite_data.favorite || favorite_data.alias)
	const [card, setCard] = useState<BasicCardData<any> | undefined>(undefined)
	const [cardImage, setCardImage] = useState<CardImages | undefined>(undefined)
	useEffect(() => {
		async function get() {
			const result = await Card.getImageFromCard(card as any)
			setCardImage(result)
		}
		get()
	},[card])
	useEffect(() => {
		if (data?.data) {
			if (data.data.cardlist?.length > 0) {
				setCard(data?.data.cardlist[0])
			}
		}
	}, [data?.data])

	const styles = Application.styles
	if (isError) {
		return (
			<View>
				<Text>error</Text>
			</View>
		)
	}

	return (
		<Animated.View
			entering={FadeInRight}
			style={{
				...props.style,
			}}
			key={`card-${index}`}
		>
			<TouchableOpacity
				activeOpacity={0.7}
				className="items-center flex-row py-5 px-5 w-80 h-32 rounded-[16px]"
				disabled={isLoading}
				style={{
					backgroundColor: styles.white,
					elevation: 2,
					shadowOffset: { height: 4, width: 4 },
				}}
				onPress={() => {
					navigation.push("card_details", {
						favorite_data: favorite_data,
						card: card,
						is_virtual: card?.virtualCard === "1" || favorite_data.type === "33",
					})
				}}
				onLongPress={() => {
					Clipboard.setString(favorite_data.favorite || favorite_data.alias)
					ToastAndroid.show("Kart numarası kopyalandı!", ToastAndroid.SHORT)
					// vibrate device
					Vibration.vibrate(100)
				}}
			>
				<View className="w-28 h-36 top-1 -ml-12 mr-6 items-center justify-center">
					{cardImage?<Animated.Image
						className="h-64 rotate-90"
						style={{ width: 4 * 40, objectFit: "contain" }}
						source={{
							uri: cardImage
						}}
					/>:<CustomLoadingIndicator/>}
				</View>
				{card?.loads_in_line ? (
					<View className="absolute w-6 h-6 justify-center -right-1.5 -top-1.5 self-start rounded-full bg-red-400">
						<Text className="text-white text-center text-xl font-bold">{card.loads_in_line?.length}</Text>
					</View>
				) : null}
				<View className="flex-1 flex-row items-center justify-between">
					<View className="flex-col flex-2 w-full">
						<Text numberOfLines={1} style={{ color: styles.primary }} className="flex-1 text-2xl font-bold w-full bottom-2 text-left">
							{favorite_data.description || (card?.virtualCard && "QR Kart") || "Adsız Kart"}
						</Text>
						<Text
							style={{
								color: styles.white,
								backgroundColor: styles.secondary,
								width: 28 * 4,
							}}
							className="rounded-full mt-3 px-4 bottom-5 relative justify-center font-bold text-[12px] text-center"
						>
							{favorite_data.favorite || favorite_data.alias || "key_error (favorite)"}
						</Text>
						{card ? (
							<View className="flex-1 flex-row">
								<Text adjustsFontSizeToFit={true} style={{ color: styles.secondary, fontSize: 34, textAlignVertical: "bottom" }} className="opacity-50 font-bold text-left">
									{card.balance || "key_error (balance)"} TL
								</Text>
								{isLoading || isRefetching ? <CustomLoadingIndicator color={Application.styles.secondary} style={{ marginLeft: 10 }} size={15} /> : null}
							</View>
						) : (
							<CustomLoadingIndicator color={Application.styles.secondary} size={20} />
						)}
					</View>
					<View className="flex-1 items-end -mr-3 justify-center opacity-[0.15] ">
						<MaterialCommunityIcons color={styles.secondary} name="arrow-right-thick" style={{ width: 40 }} size={50} className="flex-1 " />
					</View>
				</View>
			</TouchableOpacity>
		</Animated.View>
	)
}
