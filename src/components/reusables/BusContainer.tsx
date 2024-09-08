import BusData from "common/interfaces/KentKart/BusData"
import { Image, Text, TouchableOpacity, View } from "react-native"

import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetBusImages } from "common/hooks/fkart/bus/useGetBusImages"
import RouteData from "common/interfaces/KentKart/RouteData"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import Divider from "components/reusables/Divider"
import { router } from "expo-router"
import React, { useContext } from "react"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
export default function BusContainer(props: { bus: BusData; route_data: RouteData; onPress?: () => void; onLongPress?: () => void; children?: any }) {
	const { theme } = useContext(ThemeContext)
	const { bus, route_data } = props
	const schedule_list = route_data?.timeTableList
	const departure_time = schedule_list?.find((e) => e.tripId === bus.tripId)?.departureTime?.slice(0, 5) || "--:--"
	const { data, isLoading, isError } = useGetBusImages(bus)
	function isEmpty() {
		return ![bus.ac, bus.bike, bus.disabledPerson].find((e) => e === "1")
	}
	function getStopFromId(id: string) {
		return route_data.busStopList.find((e) => e.stopId === id)
	}
	return (
		<TouchableOpacity
			style={{
				backgroundColor: theme.white,
				borderRadius: 16,
				shadowOffset: { height: 4, width: 4 },
				minHeight: 48 * 4,
			}}
			onPress={
				props.onPress ||
				(() => {
					router.navigate({ pathname: "/bus_details", params: { bus64: btoa(escape(JSON.stringify(bus))) } })
				})
			}
			onLongPress={props.onLongPress}
			className="w-48 overflow-hidden h-max"
		>
			{/* MARK: title */}
			<View className="flex-row h-6 items-center justify-center bg-transparent">
				<Text
					className="text-center font-bold mr-2"
					style={{
						color: theme.secondary,
					}}
				>
					{bus.pickMeUp === "1" ? <MaterialCommunityIcons name="bus-stop-covered" color={theme.error} size={20} /> : null}
					<MaterialCommunityIcons size={16} name={bus.vehicleType === "4" ? "ferry" : "bus"} />
					{bus.plateNumber} {departure_time}
				</Text>
				{!isEmpty() && (
					<React.Fragment>
						<Divider height={"70%"} />
						<View className="flex-row ml-2">
							{bus.disabledPerson === "1" ?? <MaterialCommunityIcons color={theme.primary} size={16} name="human-wheelchair" />}
							{bus.ac === "1" ?? <MaterialCommunityIcons size={16} color={theme.primary} name="air-conditioner" />}
							{bus.bike === "1" ?? <MaterialCommunityIcons size={16} color={theme.primary} name="bike" />}
						</View>
					</React.Fragment>
				)}
			</View>
			{/* MARK: Image */}
			{isLoading ? (
				<CustomLoadingIndicator color={theme.white} style={{ height: "100%" }} />
			) : data?.data?.data[0] ? (
				<View>
					<Image
						className="overflow-hidden"
						style={{
							height: 36 * 4,
							width: "100%",
							objectFit: "cover",
						}}
						source={{
							uri: data?.data.data[0]?.url,
						}}
					/>
					<Text className="text-white self-center absolute bottom-0 font-bold">
						By {data?.data.data[0]?.uploader || "phasenull"} at {data?.data.data[0]?.uploadedAt.slice(0, 10) || "????-??-??"}
					</Text>
				</View>
			) : (
				<Text className="h-36 bg-red-400 text-center font-bold text-white px-4" style={{
					textAlignVertical:"center",
					paddingVertical:4*4,
				}}>No Image Found</Text>
			)}
			{/* MARK: Bus Stop */}
			<Text style={{ color: theme.secondary }} adjustsFontSizeToFit={true} numberOfLines={2} className="self-center text-center font-bold">
				<MaterialCommunityIcons name="map-marker" color={theme.primary} size={20} />
				{bus.stopId+" "}
				{getStopFromId(bus.stopId)?.stopName || "Hareket Halinde"}
			</Text>
			{props.children}
		</TouchableOpacity>
	)
}
