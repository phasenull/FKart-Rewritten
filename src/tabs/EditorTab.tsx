import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Text, View } from "react-native"
import FKartAuthValidator from "components/validators/FKartAuthValidator"
import FKartAuthWall from "components/walls/FKartAuthWall"
import { TouchableOpacity } from "react-native-gesture-handler"
import CardJSONData from "screens/card_details/CardJSONData"
import { useContext } from "react"
import { FKartContext } from "common/contexts/FKartContext"
import SimplyButton from "components/ui/SimplyButton"

export default function EditorTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const { fkartUser,userManager } = useContext(FKartContext)
	return (
		<FKartAuthValidator else={<FKartAuthWall navigation={props.navigation} />}>
			<View className="flex-1 items-center justify-center">
				<Text className="self-center">Editor Page</Text>
				<SimplyButton text={"logout"} onPress={userManager.logout} />
				<CardJSONData card={fkartUser} favorite_data={{}} />
			</View>
		</FKartAuthValidator>
	)
}
