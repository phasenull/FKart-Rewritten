import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ThemeContext } from "common/contexts/ThemeContext"
import Divider from "components/reusables/Divider"
import SecondaryText from "components/reusables/SecondaryText"
import { router } from "expo-router"
import { useContext } from "react"
import { TouchableOpacity } from "react-native"
import { View } from "react-native"
import { IconProps } from "react-native-vector-icons/Icon"

function QuickButton(props: { label: string; icon: string,onPress?:()=>void }) {
	const { theme } = useContext(ThemeContext)
	return (
		<TouchableOpacity onPress={props.onPress} className="items-center mx-4 w-24 aspect-square">
			<MaterialCommunityIcons color={theme.primary} size={16 * 4} name={props.icon as any} />
			<SecondaryText>{props.label}</SecondaryText>
		</TouchableOpacity>
	)
}

export default function NavigationContainer() {
	return (
		<View className="flex-col mt-12">
			<View className="flex-row items-center space-x-4">
				<QuickButton icon="alarm" label="alarms" onPress={()=>router.navigate("/alarms")} />
				<Divider height={60} />
				<QuickButton icon="badge-account-horizontal" label="editor" />
				<Divider height={60} />
				<QuickButton icon="upload" label="uploads" />
			</View>
		</View>
	)
}
