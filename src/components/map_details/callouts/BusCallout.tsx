import { Text, View } from "react-native"
import RouteData from "common/interfaces/KentKart/RouteData"
import BusData from "common/interfaces/KentKart/BusData"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import React, { useContext } from "react"
import Divider from "components/reusables/Divider"
import { ThemeContext } from "common/contexts/ThemeContext"
import SecondaryText from "components/reusables/SecondaryText"
import { transit_realtime } from "gtfs-realtime-bindings"

export function BusCallout(props: { raw?: transit_realtime.FeedEntity; is_rt?: boolean; scheduled_data: any; route_data: RouteData; bus: BusData }) {
	const { scheduled_data, bus, route_data } = props
	const departure_time = scheduled_data?.departureTime?.slice(0, 5) || "--:--"
	const { theme } = useContext(ThemeContext)

	return (
		<View
			className="flex-row p-1"
			style={{
				minWidth: (props.is_rt ? 24 : 30) * 4,
				minHeight: (props.is_rt ? 24 : 12) * 4,
				backgroundColor: theme.white,
				borderRadius: 16,
				borderColor: theme.secondary,
				borderWidth: 1.5,
			}}
		>
			<View className="flex-1 flex-col">
				<Text
					style={{
						color: theme.secondary,
						fontWeight: "800",
					}}
					numberOfLines={1}
					adjustsFontSizeToFit={true}
					// className="bg-red-400"
				>
					{bus.plateNumber}
				</Text>

				{props.is_rt ? (
					<View className="flex-col mt-1">
						<Text
							style={{
								color: theme.primaryDark,
								fontWeight: "800",
							}}
							numberOfLines={1}
							adjustsFontSizeToFit={true}
						>
							<MaterialCommunityIcons name="map-marker-path" size={16} />
							{props.route_data.path_code.split("|")[2]}
						</Text>
						<Text
							style={{
								color: theme.secondary,
								fontWeight: "800",
							}}
							numberOfLines={3}
							adjustsFontSizeToFit={true}
						>
							{props.route_data.tripShortName.slice(0, 30)}
						</Text>
						<Text
							style={{
								color: theme.secondary,
								fontWeight: "500",
							}}
							numberOfLines={1}
							adjustsFontSizeToFit={true}
						>
							{Math.floor(((props.raw?.vehicle?.position?.speed || 0) * 3.6) * 10) / 10} km/h
						</Text>
					</View>
				) : (
					<SecondaryText>
						<MaterialCommunityIcons name="clock-outline" size={16} /> {departure_time}
					</SecondaryText>
				)}
			</View>
			{[bus.disabledPerson, bus.ac, bus.bike].includes("1") ? <Divider height={"70%"} className="mx-2" /> : null}
			{props.is_rt ? null : (
				<View className="flex-col self-start ml-1">
					{bus.disabledPerson === "1" ? <MaterialCommunityIcons color={theme.primary} size={14} name="human-wheelchair" /> : null}
					{bus.ac === "1" ? <MaterialCommunityIcons size={14} color={theme.primary} name="air-conditioner" /> : null}
					{bus.bike === "1" ? <MaterialCommunityIcons size={14} color={theme.primary} name="bike" /> : null}
				</View>
			)}
			<View className="right-0">
				<MaterialCommunityIcons size={20} color={theme.secondary} name="arrow-right-thick" />
				{props.is_rt ? (
					<View className="flex-col self-start ml-1">
						{bus.disabledPerson === "1" ? <MaterialCommunityIcons color={theme.primary} size={14} name="human-wheelchair" /> : null}
						{bus.ac === "1" ? <MaterialCommunityIcons size={14} color={theme.primary} name="air-conditioner" /> : null}
						{bus.bike === "1" ? <MaterialCommunityIcons size={14} color={theme.primary} name="bike" /> : null}
					</View>
				) : null}
			</View>
		</View>
	)
}
