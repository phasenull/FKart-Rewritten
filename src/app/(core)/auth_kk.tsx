import { StatusBar } from "expo-status-bar"
import { useContext, useEffect } from "react"
import { TouchableOpacity, View, useWindowDimensions } from "react-native"
import Animated, { useSharedValue, withTiming } from "react-native-reanimated"


import { ThemeContext } from "common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import AuthPanel from "components/auth_kk/AuthPanel"
import SecondaryText from "components/reusables/SecondaryText"
import KentKartAuthValidator from "components/validators/KentKartAuthValidator"
import { Redirect, router } from "expo-router"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export default function AuthPage() {
	const { theme } = useContext(ThemeContext)

	const page_width = useWindowDimensions().width
	const translateX = useSharedValue(0)
	function updatePage(index: number) {
		translateX.value = withTiming(page_width * (1 - index) - page_width, { duration: 250 })
	}
	useEffect(() => {
		updatePage(0)
	}, [])
	const  user  = useKentKartAuthStore((state)=>state.user)
	const  credentials  = useKentKartAuthStore((state)=>state.credentials)
	if (credentials.access_token) {
		// console.log("Already logged in (?)")
		return <Redirect href={{pathname:"/RootScreen"}}/>
	}
	return (
		<KentKartAuthValidator
			else={
				<View>
					<StatusBar style="auto" />
					<Animated.View style={{ transform: [{ translateX: translateX }], width: page_width * 2 }} className={"flex-row h-full"}>
						<AuthPanel updatePage={updatePage} panel_type={0} />
						<AuthPanel updatePage={updatePage} panel_type={1} />
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
						router.replace("/RootScreen")
					}}
				>
					<SecondaryText style={{ color: theme.white, fontSize: 32 }}>Go home</SecondaryText>
				</TouchableOpacity>
			</View>
		</KentKartAuthValidator>
	)
}
