import { useEffect, useMemo, useState } from "react"
import { Image, Text, View } from "react-native"

import Application from "../../common/Application"
import { BasicCardData } from "../../common/interfaces/BasicCardData"
import { getQRCode } from "../../common/hooks/useGetQRCode"
import { Animated, Easing } from "react-native"

export default function VirtualCardQRCodePanel(props: { card: BasicCardData<"Basic" | "QR">; token?: { expireDate: string; token: string; aliasNo: string } }) {
	const styles = Application.styles
	const { card, token } = props
	const image_url = getQRCode(token?.token)
	
	return useMemo(() => {
		console.log("VirtualCardQRCodePanel render")

		if (!card || !token || !card.virtualCard) {
			return null
		}
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
				{/* <Animated.View
					style={[
						{
							backgroundColor: styles.primary,
							height: 16,
						},
					]}
				/> */}
			</View>
		)
	}, [card, token])
}
