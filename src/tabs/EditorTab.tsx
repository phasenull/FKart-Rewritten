import { useFKartAuthStore } from "common/stores/FKartAuthStore"
import CardJSONData from "components/card_details/CardJSONData"
import LogsView from "components/fkart/editor/tab/LogsView"
import SecondaryText from "components/reusables/SecondaryText"
import SimplyButton from "components/ui/SimplyButton"
import FKartAuthValidator from "components/validators/FKartAuthValidator"
import FKartAuthWall from "components/walls/FKartAuthWall"
import { ScrollView } from "react-native"

export default function EditorTab(props: { route: any;  }) {
	const { user,logout } = useFKartAuthStore()
	return (
		<FKartAuthValidator else={<FKartAuthWall />}>
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
