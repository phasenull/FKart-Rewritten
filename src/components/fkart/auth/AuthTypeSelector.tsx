import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useContext, useEffect } from "react"
import { BackHandler, Image, Keyboard, Text, TouchableWithoutFeedback, View, useWindowDimensions } from "react-native"

import ApplicationConfig from "common/ApplicationConfig"
import { ThemeContext } from "common/contexts/ThemeContext"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import SimplyButton from "components/ui/SimplyButton"
import { useNavigation } from "expo-router"
import { TouchableOpacity } from "react-native"
import Animated, { FadeIn, useSharedValue, withSpring } from "react-native-reanimated"
import GetUserPage from "./get/GetUserPage"
import PushUserPage from "./push/PushUserPage"

export default function FKartAuthTypeSelector() {
	const { translations } = useContext(TranslationsContext)
	const page_height = useWindowDimensions().height
	const translateY = useSharedValue(0)
	const { theme } = useContext(ThemeContext)
	function updatePage(index: number) {
		translateY.value = withSpring(page_height * (0 - index) - page_height, { duration: 500, dampingRatio: 0.75 })
	}
	const navigation = useNavigation()
	useEffect(() => {
		updatePage(0)
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			if (navigation.getState().index === 0) {
				updatePage(0)
				return true
			}
			return false
		})
		return () => {
			backHandler.remove()
		}
	}, [])

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss()
			}}
		>
			<Animated.View style={{ transform: [{ translateY: translateY }], height: page_height * 3,zIndex:3 }} className={"flex-col"}>
				<PushUserPage goBack={() => updatePage(0)} />
				<View className="flex-1">
					<TouchableOpacity
						className="absolute top-4 right-4 self-end rounded-full"
						onPress={() => alert(`navigation.navigate("fkart.auth.welcomer")`)}
						style={{
							backgroundColor: theme.white,
						}}
					>
						<MaterialCommunityIcons name="help" size={18 * 4} color={theme.secondary} />
					</TouchableOpacity>
					<View className="flex-1 items-center justify-center">
						<Animated.View entering={FadeIn.duration(300)} className="flex-row items-end justify-center">
							<Text className="text-3xl" style={{ fontWeight: "800", color: theme.secondary }}>
								{ApplicationConfig.name} {translations.screens.fkart.editor}
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
						<SimplyButton text={translations.signup} type="primary" onPress={() => updatePage(-1)} />
						<SimplyButton text={`${translations.or} ${translations.signin}`} onPress={() => updatePage(1)} type="text" />
					</View>
				</View>
				<GetUserPage goBack={() => updatePage(0)} />
			</Animated.View>
		</TouchableWithoutFeedback>
	)
}
