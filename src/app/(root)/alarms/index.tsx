import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ThemeContext } from "common/contexts/ThemeContext"
import SecondaryText from "components/reusables/SecondaryText"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { useContext } from "react"
import { ScrollView, View } from "react-native"

import { alarms } from "common/schema"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"
import { eq, sql } from "drizzle-orm"
import { drizzleDB } from "app"

function AlarmView(props: { alarm: typeof alarms }) {
	return (
		<View>
			<SecondaryText>{JSON.stringify(props.alarm, undefined, 4)}</SecondaryText>
		</View>
	)
}
function AlarmList(props: { alarms: any[] }) {
	const { theme } = useContext(ThemeContext)
	if (!props.alarms || props.alarms?.length === 0) {
		return (
			<View
				className="items-center justify-center flex-1"
				style={{
					flex: 1,
					backgroundColor: theme.dark,
				}}
			>
				<TouchableOpacity
					onPress={() => {
						// drizzleDB
						// 	.insert(alarms)
						// 	.values({ label: "generated", })
						// 	.then((e) => {
						// 		console.log(e)
						// 	})
					}}
					className="items-center"
				>
					<MaterialCommunityIcons size={32 * 4} color={theme.secondary} name="plus"></MaterialCommunityIcons>
					<SecondaryText>Create Alarm!</SecondaryText>
				</TouchableOpacity>
			</View>
		)
	}
	return (
		<ScrollView
			contentContainerStyle={{}}
			style={{
				backgroundColor: theme.dark,
				flex: 1,
				paddingHorizontal: 4 * 4,
			}}
		>
			<TouchableOpacity
				onPress={() => {
					drizzleDB.delete(alarms).then((e)=>{
						console.log("delete result",e)
						drizzleDB
						.insert(alarms)
						.values({
							label: "generated",
							type: "creation",
							routes: [
								{ type: "display", id: "33" },
								{ type: "route", id: "41033" },
								{ type: "trip", id: "2407798", route_code: "41033", time: "13:30:00" },
							],
						})})
				}}
				className="items-center"
			>
				<MaterialCommunityIcons size={32 * 4} color={theme.secondary} name="plus"></MaterialCommunityIcons>
				<SecondaryText>Create Alarm!</SecondaryText>
			</TouchableOpacity>
			{props.alarms.map((alarm) => (
				<AlarmView alarm={alarm} />
			))}
		</ScrollView>
	)
}
export default function ScreenAlarms(props: { navigation: NativeStackNavigationProp<any> }) {
	const { theme } = useContext(ThemeContext)
	const { data: data_alarms } = useLiveQuery(drizzleDB.select().from(alarms))
	console.log(data_alarms)
	props.navigation.setOptions({
		headerShown: true,
		headerTintColor: theme.secondary,
		headerTitle: () => <SecondaryText>My Alarms</SecondaryText>,
	})
	return <AlarmList alarms={data_alarms} />
}
