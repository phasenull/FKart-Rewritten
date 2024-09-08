import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ThemeContext } from "common/contexts/ThemeContext"
import SecondaryText from "components/reusables/SecondaryText"
import { router } from "expo-router"
import { useContext } from "react"
import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

export default function () {
	const {theme} = useContext(ThemeContext)
	return (
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
	)
}
