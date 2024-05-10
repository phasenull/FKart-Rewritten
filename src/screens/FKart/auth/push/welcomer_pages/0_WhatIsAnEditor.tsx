import { Image, Text, View } from "react-native"
import { TranslationsContext } from "../../../../../common/contexts/TranslationsContext"
import { useContext } from "react"
import Animated, { FadeIn } from "react-native-reanimated"
import Application from "../../../../../common/Application"

export default function WhatIsAnEditor(props: {}) {
	const { translations } = useContext(TranslationsContext)
	return (
		<View className="justify-center flex-col flex-1 items-center">
			<Animated.View entering={FadeIn.duration(300)} className="flex-row items-end justify-center">
				<Text className="text-3xl" style={{ fontWeight: "800", color: Application.styles.secondary }}>
					{translations.screens.fkart.auth.welcomer.what_is_an_editor_title}
				</Text>
			</Animated.View>
			<Image
				style={{
					marginVertical: 16,
					width: 48 * 4,
					height: 48 * 4,
					opacity: 0.2,
				}}
				source={{ uri: "https://icons.veryicon.com/png/o/business/classic-icon/community-12.png" }}
			/>
			<Text
				style={{
					color: Application.styles.secondary,
					fontWeight: "600",
					fontSize: 16,
					textAlign: "center",
				}}
			>
				{translations.screens.fkart.auth.welcomer.what_is_an_editor_desc}
			</Text>
		</View>
	)
}
