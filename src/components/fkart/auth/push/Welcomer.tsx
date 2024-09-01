import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Paginator } from "./Paginator";
import WhatIsAnEditor from "./welcomer_pages/0_WhatIsAnEditor";
import HowDoIBecomeOne from "./welcomer_pages/1_HowToBecomeOne";
import { View } from "react-native";

export default function FKartWelcomer (props:{navigation:NativeStackNavigationProp<any>}) {
	return <View className="flex-1">
		<Paginator navigation={props.navigation} initialIndex={0}>
			<WhatIsAnEditor/>
			<HowDoIBecomeOne/>
		</Paginator>
	</View>
}