import { Image, Text, View } from "react-native"
import Application from "../../../common/Application"
import Animated, { FadeIn } from "react-native-reanimated"
import * as Updates from "expo-updates"
export function IIPage1(props:{last_check:number}) {
	return (
		<View className="justify-center flex-col flex-1 items-center">
			<Animated.View entering={FadeIn.duration(300)} className="flex-row items-end justify-center">
				<Text className="text-6xl" style={{ fontWeight: "800", color: Application.styles.primary }}>
					{Application.name}
				</Text>
				<Text className="text-md" style={{ fontWeight: "800", color: Application.styles.secondary, opacity: 0.5 }}>
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
					color: Application.styles.secondary,
					fontWeight: "600",
					fontSize: 16,
				}}
			>
				unofficial public transit app for
				<Text style={{ color: Application.styles.primary }}>{""} Kocaeli</Text>
			</Text>
			<Text
				style={{
					color: Application.styles.secondary,
					fontSize: 16,
				}}
			>
				and 23 other cities!
			</Text>
			<Text
				style={{
					position:"absolute",
					bottom:0,
					color: Application.styles.secondary,
					fontSize: 16,
					opacity:0.1
				}}>
				Last Update Check:
				{"\n"}{new Date(props.last_check).toUTCString()}
			</Text>
		</View>
	)
}
