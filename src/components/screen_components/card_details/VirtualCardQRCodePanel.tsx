import { useEffect, useMemo, useState } from "react"
import { Image, Text, View } from "react-native"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import Application from "../../common/Application"
import { BasicCardData } from "../../common/interfaces/KentKart/object/BasicCardData"
import { Favorite } from "../../common/interfaces/KentKart/object/Favorite"
import { getQRCode } from "../../common/hooks/useGetQRCode"

export default function VirtualCardQRCodePanel(props: { card: BasicCardData<"Basic" | "QR">; token?: { expireDate: string; token: string; aliasNo: string } }) {
	const styles = Application.styles
	const { card, token } = props
	const linear = useSharedValue(100)
	const image_url = getQRCode(token?.token)

	const animatedChanged = useAnimatedStyle(() => ({
		width: `${linear.value}%`,
	}))
	return useMemo(() => {
		console.log("VirtualCardQRCodePanel render")
		if (!card || !token || !card.virtualCard) {
			return null
		}
		linear.value = 100
		linear.value = withTiming(0, { duration: Application.sync_interval, easing: Easing.linear })
		return (
			<View
				className="flex-col my-4 w-80 overflow-hidden"
				style={{
					backgroundColor: styles.white,
					borderRadius: 16,
					elevation: 2,
				}}
			>
				<Text style={{ color: styles.secondary, fontSize: 32, fontWeight: "600" }} className="flex-1 my-2 text-center">
					Ücret: {card.paxDescription}
				</Text>
				<Image
					className="self-center"
					style={{
						height: 64 * 4,
						width: 64 * 4,
						marginBottom: 4 * 4,
					}}
					source={{ uri: image_url }}
				/>
				<Animated.View style={[animatedChanged, { backgroundColor: styles.primary, height: 16 }]} />
			</View>
		)
	}, [card, token])
}
