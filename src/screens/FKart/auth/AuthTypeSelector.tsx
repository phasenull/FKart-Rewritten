import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import SecondaryText from "../../../components/root/SecondaryText"
import { useContext, useEffect } from "react"
import { TranslationsContext } from "../../../common/contexts/TranslationsContext"
import Button from "../../../components/ui/Button"
import Application from "../../../common/Application"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { BackHandler, Image, Text, View, useWindowDimensions } from "react-native"
import Animated, { FadeIn, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import { TouchableOpacity } from "react-native-gesture-handler"
import PushUserPage from "./push/PushUserPage"

export default function FKartAuthTypeSelector(props: { navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	const { translations } = useContext(TranslationsContext)
	const page_height = useWindowDimensions().height
	const translateY = useSharedValue(0)
	const styles = Application.styles
	function updatePage(index: number) {
		translateY.value = withSpring(page_height * (0 - index) - page_height, { duration: 500, dampingRatio: 0.75 })
	}
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
		<Animated.View style={{ transform: [{ translateY: translateY }], height: page_height * 3 }} className={"flex-col"}>
			<PushUserPage goBack={() => updatePage(0)}>
				
			</PushUserPage>
			<View className="flex-1">
				<TouchableOpacity
					className="absolute top-4 right-4 self-end rounded-full"
					onPress={() => navigation.navigate("fkart.auth.welcomer")}
					style={{
						backgroundColor: Application.styles.white,
					}}
				>
					<MaterialCommunityIcons name="help" size={18 * 4} color={Application.styles.secondary} />
				</TouchableOpacity>
				<View className="flex-1 items-center justify-center">
					<Animated.View entering={FadeIn.duration(300)} className="flex-row items-end justify-center">
						<Text className="text-3xl" style={{ fontWeight: "800", color: Application.styles.secondary }}>
							{Application.name} {translations.screens.fkart.editor}
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
					<Button text={translations.signup} type="primary" onPress={() => updatePage(-1)} />
					<Button text={`${translations.or} ${translations.signin}`} onPress={() => updatePage(1)} type="text" />
				</View>
			</View>
			<View className="flex-1">
				<SecondaryText>SignIn</SecondaryText>
			</View>
		</Animated.View>
	)
}
