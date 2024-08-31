import { Image, Text, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import { useContext } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"

export function IIPage2() {
	const {translations} = useContext(TranslationsContext)
	const {theme} = useContext(ThemeContext)

	return (
		<View className="justify-center flex-col flex-1 items-center">
			<Animated.View  entering={FadeIn.duration(300)} className="flex-row items-end justify-center">
				<Text className="text-3xl" style={{ fontWeight: "800", color: theme.secondary }}>
					{translations.screens.welcomer.by_people_for_people}
				</Text>
			</Animated.View>
			<Image
				style={{
					marginVertical: 16,
					width: 48 * 4,
					height: 48 * 4,
					opacity:0.2
				}}
				source={{ uri: "https://icons.veryicon.com/png/o/business/classic-icon/community-12.png" }}
			/>
			<Text
				style={{
					color: theme.secondary,
					fontWeight: "600",
					fontSize: 16,
					textAlign:"center"
				}}
			>
				{translations.screens.welcomer.guides_and_data_corrections}
			</Text>
		</View>
	)
}
