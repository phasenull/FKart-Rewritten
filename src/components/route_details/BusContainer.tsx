import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import BusData from "../../common/interfaces/BusData"
import {
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import Application from "../../common/Application"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Divider from "../Divider"
import React from "react"
import RouteData from "../../common/interfaces/RouteData"
import { useGetBusImages } from "../../common/hooks/useGetBusImages"
import CustomLoadingIndicator from "../CustomLoadingIndicator"
export default function BusContainer(props: {
	navigation: NativeStackNavigationProp<any>
	bus: BusData
	route_data: RouteData
	onPress?: () => void
	onLongPress?: () => void
}) {
	const { bus, navigation, route_data } = props
	const schedule_list = route_data?.timeTableList
	const departure_time = (schedule_list?.find((e) => e.tripId === bus.tripId)?.departureTime)?.slice(0,5) || "--:--"
	const { data, isLoading, isError } = useGetBusImages(bus)
	function isEmpty() {
		return ![bus.ac, bus.bike, bus.disabledPerson].find(
			(e) => e === "1"
		)
	}
	function getStopFromId(id: string) {
		return route_data.busStopList.find((e) => e.stopId === id)
	}
	return (
		<TouchableOpacity
			style={{
				backgroundColor: Application.styles.white,
				borderRadius: 16,
				elevation: 2,
				shadowOffset: { height: 4, width: 4 },
			}}
			onPress={props.onPress ||( () => {
				navigation.navigate("bus_details", {
					bus,
				})
			})}
			onLongPress={props.onLongPress}
			className="h-48 w-80 flex-col overflow-hidden"
		>
			{/* title */}
			<View className="flex-row pb-1 h-8 bg-red-400 items-center justify-center rounded-t-[16px]">
				<Text
					className="text-center font-bold mr-2"
					style={{
						color: Application.styles.secondary,
					}}
				>
					{bus.pickMeUp === "1" ? (
						<MaterialCommunityIcons
							name="bus-stop-covered"
							color={Application.styles.warning}
							size={20}
						/>
					) : null}
					<MaterialCommunityIcons
						size={16}
						name={bus.vehicleType === "4" ? "ferry" : "bus"}
					/>
					{bus.plateNumber} {departure_time}
				</Text>
				{isEmpty() ? null : (
					<React.Fragment>
						<Divider className="" />
						<View className="flex-row ml-2">
							{bus.disabledPerson === "1" ? (
								<MaterialCommunityIcons
									color={Application.styles.primary}
									size={16}
									name="human-wheelchair"
								/>
							) : null}
							{bus.ac === "1" ? (
								<MaterialCommunityIcons
									size={16}
									color={Application.styles.primary}
									name="air-conditioner"
								/>
							) : null}
							{bus.bike === "1" ? (
								<MaterialCommunityIcons
									size={16}
									color={Application.styles.primary}
									name="bike"
								/>
							) : null}
						</View>
					</React.Fragment>
				)}
			</View>
			<View className="w-full flex-1 items-center justify-center">
				{isLoading ? (
					<CustomLoadingIndicator color={Application.styles.white} style={{ height: "100%" }} />
				) : data?.data.data[0] ? (
					<React.Fragment>
						<Image
							className="overflow-hidden"
							style={{
								width: "100%",
								height: "auto",
								minHeight: 36 * 4,
								maxHeight: 200,
							}}
							source={{
								uri:
									data?.data.data[0]?.url
							}}
						/>
						<Text className="absolute bottom-0 opacity-80 font-bold">
							By {data?.data.data[0]?.uploader || "Unknown user"} at{" "}
							{data?.data.data[0]?.uploadedAt.slice(0, 10) ||
								"????-??-??"}
						</Text>
					</React.Fragment>
				) : (
					<Text className="bg-red-400 text-center font-bold text-xl text-white px-4">
						No Image Found
					</Text>
				)}
			</View>
			<Text
				style={{ color: Application.styles.secondary }}
				className="text-center h-8 self-center items-center justify-center font-bold"
			>
				<MaterialCommunityIcons
					name="map-marker"
					color={Application.styles.primary}
					size={20}
				/>{" "}
				{bus.stopId}{" "}
				{getStopFromId(bus.stopId)?.stopName || "Hareket Halinde"}
			</Text>
		</TouchableOpacity>
	)
}
