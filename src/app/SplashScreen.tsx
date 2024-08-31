import ApplicationConfig from "common/ApplicationConfig"
import { ThemeContext } from "common/contexts/ThemeContext"
import SecondaryText from "components/reusables/SecondaryText"
import { useContext, useState } from "react"
import { Image, Text, View } from "react-native"
export default function SplashScreen(props:{logs?:string[]}) {
	const { theme } = useContext(ThemeContext)
	return (
		<View style={{ flex: 1, backgroundColor: theme.dark, alignItems: "center", justifyContent: "center" }}>
			<Image
				source={require("assets/media/images/icon_no_bg.png")}
				style={{
					height: 250,
					aspectRatio: 1,
					objectFit: "scale-down",
				}}
			/>
			<Text
				style={{
					color: theme.secondary,
					fontWeight:"800",
					fontSize:40
				}}
			>
				{ApplicationConfig.name}
			</Text>
			<View className="w-80 max-w-[80%] opacity-30" style={{backgroundColor:"transparent",height:80}}>
				{props.logs?.map((log,i)=><SecondaryText key={log+i}>| {log}</SecondaryText>)}
			</View>
		</View>
	)
}
