import Card from "../../common/classes/Card"
import {
	Text,
	ToastAndroid,
	TouchableOpacity,
	Vibration,
	View,
	ViewStyle,
} from "react-native"
import Animated, {
	FadeInRight,
} from "react-native-reanimated"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Application from "../../common/Application"
import { Clipboard } from "react-native"
export default function CardContainer(props: {
	card: Card
	index: number
	navigation: any
	style?: ViewStyle
}) {
	const { card: p_card, index, navigation } = props
	const styles = Application.styles
	return (
		<Animated.View
			entering={FadeInRight}
			style={{
				opacity: p_card.is_from_cache ? 0.5 : 1,
				...props.style,
			}}
			key={`card-${index}`}
		>
			<TouchableOpacity
				activeOpacity={0.7}
				className="items-center flex-row py-5 px-5 w-80 h-32 rounded-[16px]"
				style={{
					backgroundColor: styles.white,
					elevation: 10,
					shadowOffset: { height: 4, width: 4 },
				}}
				onPress={() => {
					navigation.push("card_details", { card: p_card })
				}}
				onLongPress={() => {
					Clipboard.setString(p_card.alias)
					ToastAndroid.show(
						"Kart numarası kopyalandı!",
						ToastAndroid.SHORT
					)
					// vibrate device
					Vibration.vibrate(100)

				}}
			>
				<View className="w-28 h-36 top-1 -ml-12 mr-6 items-center justify-center">
					<Animated.Image
						className="h-64 rotate-90"
						style={{ width: 4 * 40, objectFit: "contain" }}
						source={{ uri: p_card.getImage() }}
					/>
				</View>
				{p_card.loads_in_line ? (
					<View className="absolute w-6 h-6 justify-center -right-1.5 -top-1.5 self-start rounded-full bg-red-400">
						<Text className="text-white text-center text-xl font-bold">
							{p_card.loads_in_line?.length}
						</Text>
					</View>
				) : null}
				<View className="flex-1 flex-row items-center justify-between">
					<View>
						<Text
							style={{ color: styles.primary }}
							className="flex-1 font-bold text-xl bottom-2 text-left"
						>
							{p_card.description || "Adsız Kart"}
						</Text>
						<Text
							style={{
								color: styles.white,
								backgroundColor: styles.secondary,
							}}
							className="rounded-full mx-auto px-4 bottom-3 relative font-bold text-[12px] text-center"
						>
							{p_card.alias || "key_error (alias)"}
						</Text>
						<Text
							style={{ color: styles.secondary }}
							className="flex-1 opacity-50 font-bold text-2xl text-left"
						>
							{p_card.balance || "key_error (balance)"} TL
						</Text>
					</View>
					<View className="flex-1 items-end -mr-3 justify-center opacity-[0.15] ">
						<MaterialCommunityIcons
							color={styles.secondary}
							name="arrow-right-thick"
							style={{ width: 40 }}
							size={50}
							className="flex-1 "
						/>
					</View>
				</View>
			</TouchableOpacity>
		</Animated.View>
	)
}
