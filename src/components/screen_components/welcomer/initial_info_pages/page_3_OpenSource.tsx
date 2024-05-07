import { Clipboard, Image, Linking, Text, ToastAndroid, Vibration, View } from "react-native"
import Application from "../../../common/Application"
import { TouchableOpacity } from "@gorhom/bottom-sheet"
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from "react-native-reanimated"
import { TranslationsContext } from "../../../common/contexts/TranslationsContext"
import { useContext } from "react"

export function IIPage3() {
	const { translations } = useContext(TranslationsContext)

	return (
		<View className="justify-center flex-col flex-1 items-center">
			<Animated.View entering={FadeIn.duration(300)} className="flex-row items-end justify-center">
				<Text className="text-3xl" style={{ fontWeight: "800", color: Application.styles.secondary }}>
					{translations.screens.welcomer.full_transparency}
				</Text>
			</Animated.View>
			<Image
				style={{
					marginVertical: 16,
					width: 48 * 4,
					height: 48 * 4,
					opacity: 0.2,
				}}
				source={{ uri: "https://cdn-icons-png.flaticon.com/512/732/732090.png" }}
			/>
			<Text
				style={{
					color: Application.styles.secondary,
					fontWeight: "600",
					fontSize: 16,
					textAlign: "left",
				}}
			>
				{translations.screens.welcomer.open_source}
			</Text>
			<TouchableOpacity
				style={{
					backgroundColor: "#fff",
					elevation: 3,
					borderRadius: 16,
					paddingHorizontal: 4 * 4,
				}}
				onLongPress={() => {
					Clipboard.setString(Application.source_url)
					ToastAndroid.show("Copied to clipboard!", 250)
					Vibration.vibrate(100)
				}}
				onPress={() => {
					Linking.openURL(Application.source_url)
				}}
			>
				<Text className="text-black text-center absolute self-center" style={{ fontWeight: "900" }}>
					view on
				</Text>
				<Image style={{ height: 16 * 4, width: 34 * 4 }} source={{ uri: "https://pngimg.com/d/github_PNG65.png" }} />
			</TouchableOpacity>
		</View>
	)
}
