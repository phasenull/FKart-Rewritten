import { Text, View } from "react-native"
import RouteData from "common/interfaces/KentKart/RouteData"
import BusData from "common/interfaces/KentKart/BusData"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import React, { useContext } from "react"
import Divider from "components/root/Divider"
import { ThemeContext } from "common/contexts/ThemeContext"

export function BusCallout(props: { scheduled_data: any; route_data: RouteData; bus: BusData }) {
	const { scheduled_data, bus, route_data } = props
	const departure_time = scheduled_data?.departureTime?.slice(0, 5) || "--:--"
	const {theme} = useContext(ThemeContext)

	return (
		<View
			className="items-center justify-center flex-row flex-1"
			style={{
				width: 30 * 4,
				height: 12 * 4,
				backgroundColor: theme.white,
				borderRadius: 16,
				borderColor:theme.secondary,
				borderWidth:1.5
			}}
		>
			<View className="flex-col self-start justify-center items-start px-2 py-2">
				<Text
					style={{
						color: theme.secondary,
						fontWeight: "800",
					}}
				>
					{bus.plateNumber}
				</Text>
				<Text
					style={{
						color: theme.secondary,
						textAlign: "center",
						fontWeight: "800",
					}}
				>
					<MaterialCommunityIcons name="clock-outline" size={16} /> {departure_time}
				</Text>
			</View>
			{[bus.disabledPerson,bus.ac,bus.bike].includes("1") ? <Divider height={"70%"} className="mx-2" /> : null}
			<View className="flex-col self-start ml-1">
				{bus.disabledPerson === "1" ? <MaterialCommunityIcons color={theme.primary} size={14} name="human-wheelchair" /> : null}
				{bus.ac === "1" ? <MaterialCommunityIcons size={14} color={theme.primary} name="air-conditioner" /> : null}
				{bus.bike === "1" ? <MaterialCommunityIcons size={14} color={theme.primary} name="bike" /> : null}
			</View>
			<View  className="right-0">
				<MaterialCommunityIcons size={20} color={theme.secondary} name="arrow-right-thick" />
			</View>
		</View>
	)
}
