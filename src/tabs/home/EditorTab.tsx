import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, View } from "react-native"

export default function EditorTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	return <View className="flex-1 justify-center">
		<Text className="self-center">
			Editor Page
		</Text>
	</View>
}
