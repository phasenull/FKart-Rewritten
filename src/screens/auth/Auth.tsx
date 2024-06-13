import { TouchableOpacity, View, useWindowDimensions } from "react-native"
import { StatusBar } from "expo-status-bar"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useContext, useEffect, useState } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"


import KentKartAuthValidator from "components/validators/KentKartAuthValidator"
import SecondaryText from "components/root/SecondaryText"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AuthPanel from "./AuthPanel"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"

export default function AuthPage(props: { navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	const { theme } = useContext(ThemeContext)

	const page_width = useWindowDimensions().width
	const translateX = useSharedValue(0)
	function updatePage(index: number) {
		translateX.value = withTiming(page_width * (1 - index) - page_width, { duration: 250 })
	}
	useEffect(() => {
		updatePage(0)
	}, [])
	const { user } = useKentKartAuthStore((state)=>state)
	if (user) {
		navigation.replace("home")
		return <View></View>
	}
	return (
		<KentKartAuthValidator
			else={
				<View>
					<StatusBar style="auto" />
					<Animated.View style={{ transform: [{ translateX: translateX }], width: page_width * 2 }} className={"flex-row h-full"}>
						<AuthPanel updatePage={updatePage} navigation={navigation} panel_type={0} />
						<AuthPanel updatePage={updatePage} navigation={navigation} panel_type={1} />
					</Animated.View>
				</View>
			}
		>
			<View className="items-center justify-center flex-1">
				<MaterialCommunityIcons name="help" size={48 * 4} style={{ opacity: 0.3, marginBottom: 2 * 4 }} />
				<SecondaryText>Nothing to see here!</SecondaryText>
				<TouchableOpacity
					activeOpacity={0.5}
					style={{
						borderRadius: 16,
						paddingHorizontal: 32,
						paddingVertical: 12,
						marginTop: 12 * 4,
						backgroundColor: theme.primary,
					}}
					onPress={() => {
						const navigation = props.navigation
						if (navigation) {
							navigation.replace("home")
						} else {
							alert("navigation is null")
						}
					}}
				>
					<SecondaryText style={{ color: theme.white, fontSize: 32 }}>Go home</SecondaryText>
				</TouchableOpacity>
			</View>
		</KentKartAuthValidator>
	)
}
