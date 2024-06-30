import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RefreshControl, ScrollView, Text, View } from "react-native"
import FKartAuthValidator from "components/validators/FKartAuthValidator"
import FKartAuthWall from "components/walls/FKartAuthWall"
import CardJSONData from "screens/card_details/CardJSONData"
import SimplyButton from "components/ui/SimplyButton"
import LogsView from "screens/fkart/editor/tab/LogsView"
import SecondaryText from "components/reusables/SecondaryText"
import { useFKartAuthStore } from "common/stores/FKartAuthStore"

export default function EditorTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const { user,logout } = useFKartAuthStore()
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
				<CardJSONData card={user} favorite_data={{}} />

				<LogsView style={{marginBottom:12*4}} />
				<SimplyButton text={"logout"} onPress={logout} />
			</ScrollView>
		</FKartAuthValidator>
	)
}
