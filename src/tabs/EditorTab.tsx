import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Text, View } from "react-native"
import FKartAuthValidator from "../components/validators/FKartAuthValidator"
import FKartAuthWall from "../components/root/walls/FKartAuthWall";
import FKartTesting from "../screens/FKart/testing";

export default function EditorTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	return (
		<FKartAuthValidator else={<FKartTesting navigation={props.navigation}/>}>
			<View className="flex-1 justify-center">
				<Text className="self-center">Editor Page</Text>
			</View>
		</FKartAuthValidator>
	)
}
