import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import SecondaryText from "../../../components/root/SecondaryText"
import { useContext } from "react"
import { TranslationsContext } from "../../../common/contexts/TranslationsContext"
import Button from "../../../components/Button"
import Application from "../../../common/Application"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Image, Text, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

export default function FKartAuthTypeSelector(props: { navigation: NativeStackNavigationProp<any> }) {
	const {navigation} = props
	const { translations } = useContext(TranslationsContext)
	return (
		<View className="flex-1 justify-center items-center">
			<Animated.View  entering={FadeIn.duration(300)} className="flex-row items-end justify-center">
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
			<Button text={translations.signup} type="primary" onPress={()=>navigation.navigate("fkart.auth.welcomer")} />
			<Button text={`${translations.or} ${translations.signin}`} type="text" />
		</View>
	)
}
