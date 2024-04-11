import { Pressable } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

export function TabIconWrapper(props: { children: any }) {
	return <TouchableOpacity className="bg-red-400">
		{props.children}
	</TouchableOpacity>
}
