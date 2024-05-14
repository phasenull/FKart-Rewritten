import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RefreshControl, ScrollView, Text, View } from "react-native"
import FKartAuthValidator from "components/validators/FKartAuthValidator"
import FKartAuthWall from "components/walls/FKartAuthWall"
import { TouchableOpacity } from "react-native-gesture-handler"
import CardJSONData from "screens/card_details/CardJSONData"
import { useContext } from "react"
import { FKartContext } from "common/contexts/FKartContext"
import SimplyButton from "components/ui/SimplyButton"
import LogsView from "screens/fkart/editor/tab/LogsView"
import SecondaryText from "components/root/SecondaryText"

export default function EditorTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const { fkartUser, userManager } = useContext(FKartContext)
	return (
		<FKartAuthValidator else={<FKartAuthWall navigation={props.navigation} />}>
			<ScrollView
				contentContainerStyle={{
					alignItems: "center",
					paddingTop: 12 * 4,
					paddingBottom: 36 * 4,
				}}
			>
				<SecondaryText style={{fontSize:12*4}} className="self-center">Editor Page</SecondaryText>
				<CardJSONData card={fkartUser} favorite_data={{}} />

				<LogsView style={{marginBottom:12*4}} />
				<SimplyButton text={"logout"} onPress={userManager.logout} />
			</ScrollView>
		</FKartAuthValidator>
	)
}
