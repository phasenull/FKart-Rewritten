import { View } from "react-native";
import { Paginator } from "./Paginator";
import WhatIsAnEditor from "./welcomer_pages/0_WhatIsAnEditor";
import HowDoIBecomeOne from "./welcomer_pages/1_HowToBecomeOne";

export default function FKartWelcomer () {
	return <View className="flex-1">
		<Paginator initialIndex={0}>
			<WhatIsAnEditor/>
			<HowDoIBecomeOne/>
		</Paginator>
	</View>
}