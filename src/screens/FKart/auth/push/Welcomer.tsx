import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Paginator } from "./Paginator";
import WhatIsAnEditor from "./welcomer_pages/0_WhatIsAnEditor";

export default function FKartWelcomer (props:{navigation:NativeStackNavigationProp<any>}) {
	return <SafeAreaView className="flex-1">
		<Paginator navigation={props.navigation} initialIndex={0}>
			<WhatIsAnEditor/>
		</Paginator>
	</SafeAreaView>
}