import { Image, Text, View } from "react-native"
import Application from "common/Application"
import Animated, { FadeIn } from "react-native-reanimated"
import * as Updates from "expo-updates"
import { useContext } from "react"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import { ThemeContext } from "common/contexts/ThemeContext" 
export function IIPage1(props:{last_check:number}) {
	const {theme} = useContext(ThemeContext)
	const {translations} = useContext(TranslationsContext)
	return (
		<View className="justify-center flex-col flex-1 items-center">
			<Animated.View entering={FadeIn.duration(300)} className="flex-row items-end justify-center">
				<Text className="text-6xl" style={{ fontWeight: "800", color: theme.primary }}>
					{Application.name}
				</Text>
				<Text className="text-md" style={{ fontWeight: "800", color: theme.secondary, opacity: 0.5 }}>
					{" "}
					v{Application.version}-{Updates.runtimeVersion}
				</Text>
			</Animated.View>
			<Image
				style={{
					marginVertical: 16,
					width: 48 * 4,
					height: 48 * 4,
				}}
				source={{ uri: "https://tr.rbxcdn.com/87f1a2d0bd0c4d604e1a69211b602ecf/150/150/Image/Png" }}
			/>
			<Text
				style={{
					color: theme.secondary,
					fontWeight: "600",
					fontSize: 16,
				}}
			>
				{translations.screens.welcomer.unofficial_public_transit_app_for_kocaeli.map((e)=>e.mark ? 
				<Text key={e.str} style={{ color: theme.primary }}>{e.str}</Text> : e.str)}
			</Text>
			<Text
				style={{
					color: theme.secondary,
					fontSize: 16,
				}}
			>
				{translations.screens.welcomer.and_23_other_cities}
			</Text>
			<Text
				style={{
					position:"absolute",
					bottom:0,
					color: theme.secondary,
					fontSize: 16,
					opacity:0.1
				}}>
				{translations.screens.welcomer.last_update_check}
				{"\n"}{new Date(props.last_check).toUTCString()}
			</Text>
		</View>
	)
}
