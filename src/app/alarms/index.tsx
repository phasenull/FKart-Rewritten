import { ThemeContext } from "common/contexts/ThemeContext"
import SecondaryText from "components/reusables/SecondaryText"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { useContext } from "react"
import { ScrollView, View } from "react-native"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { drizzleDB } from "app/_layout"
import { alarms } from "common/schema"
import { Stack } from "expo-router"
import { TouchableOpacity } from "react-native"
import { router } from "expo-router"

function AlarmView(props: { alarm: typeof alarms.$inferSelect }) {
	return (
		<View>
			<SecondaryText>{JSON.stringify(props.alarm, undefined, 4)}</SecondaryText>
		</View>
	)
}
function AlarmList(props: { alarms: (typeof alarms.$inferSelect)[] }) {
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
				<TouchableOpacity onPress={() => router.navigate("/alarms/creator")} className="items-center">
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
			<TouchableOpacity onPress={() => router.navigate("/alarms/creator")} className="items-center">
				<MaterialCommunityIcons size={32 * 4} color={theme.secondary} name="plus"></MaterialCommunityIcons>
				<SecondaryText>Create Alarm!</SecondaryText>
			</TouchableOpacity>
			{props.alarms.map((alarm) => (
				<AlarmView key={alarm.id} alarm={alarm} />
			))}
		</ScrollView>
	)
}
export default function ScreenAlarms() {
	const { theme } = useContext(ThemeContext)
	const { data: data_alarms } = useLiveQuery(drizzleDB.select().from(alarms))
	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTintColor: theme.secondary,
					headerTitle: () => <SecondaryText>My Alarms</SecondaryText>,
				}}
			/>
			<AlarmList alarms={data_alarms} />
		</>
	)
}
