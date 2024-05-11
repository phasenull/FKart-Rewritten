import { MaterialCommunityIcons } from "@expo/vector-icons"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import SecondaryText from "components/root/SecondaryText"
import { TouchableOpacity } from "react-native-gesture-handler"
import { View } from "react-native"
import { useContext } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"

export default function (props: { navigation: NativeStackNavigationProp<any> }) {
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
	)
}
