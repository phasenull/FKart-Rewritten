import { MaterialCommunityIcons } from "@expo/vector-icons"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { SafeAreaView } from "react-native-safe-area-context"
import SecondaryText from "../SecondaryText"
import { TouchableOpacity } from "react-native-gesture-handler"
import Application from "../../../common/Application"

export default function (props: { navigation: NativeStackNavigationProp<any> }) {
	return (
		<SafeAreaView className="items-center justify-center flex-1">
			<MaterialCommunityIcons name="help" size={48 * 4} style={{ opacity: 0.3, marginBottom: 2 * 4 }} />
			<SecondaryText>Nothing to see here!</SecondaryText>
			<TouchableOpacity
				activeOpacity={0.5}
				style={{
					borderRadius: 16,
					paddingHorizontal: 32,
					paddingVertical: 12,
					marginTop: 12 * 4,
					backgroundColor: Application.styles.primary,
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
				<SecondaryText style={{ color: Application.styles.white, fontSize: 32 }}>Go home</SecondaryText>
			</TouchableOpacity>
		</SafeAreaView>
	)
}
