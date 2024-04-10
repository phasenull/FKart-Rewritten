import { Callout, LatLng, Marker } from "react-native-maps"
import BusData from "../../../common/interfaces/BusData"
import { Image, Text, View } from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { DYNAMIC_CONTENT_URL } from "../../../common/constants"
import Application from "../../../common/Application"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Logger from "../../../common/Logger"
import RouteData from "../../../common/interfaces/RouteData"

export default function BusMarker(props: { bus: BusData; coordinate: LatLng; easterEggEnabled?: boolean; navigation: NativeStackNavigationProp<any>; route_data?: RouteData }) {
	const { route_data, bus, coordinate, easterEggEnabled, navigation } = props
	const schedule_list = route_data?.timeTableList
	const departure_time = (schedule_list?.find((e) => e.tripId === bus.tripId)?.departureTime)?.slice(0,5) || "--:--"
	console.log(departure_time)
	if (!bus || !coordinate || !navigation) {
		Logger.warning("BusMarker.tsx", "BusMarker", "Bus, coordinate or navigation is null")
		return
	}
	if (easterEggEnabled) {
		return (
			<Marker
				tracksViewChanges={false}
				anchor={{ x: 0.5, y: 0.7 }}
				style={{ alignItems: "center" }}
				flat={true}
				zIndex={12}
				rotation={parseFloat(bus.bearing)}
				calloutAnchor={{ x: 0.5, y: 0.5 }}
				coordinate={coordinate}
				title={bus.plateNumber}
				onCalloutPress={() => {
					navigation.navigate("bus_details", { bus: bus })
				}}
				// className="items-center justify-center overflow-visible"
			>
				<Image
					style={{
						objectFit: "fill",
					}}
					source={{ uri: `${DYNAMIC_CONTENT_URL}/assets/media/images/random/easter_eggs/pacman/character_0.png` }}
					className="h-8 w-8 -rotate-90"
				/>
				<Callout className="flex-col items-center">
					<Text
						style={{
							color: Application.styles.secondary,
						}}
					>
						{bus.plateNumber}
					</Text>
					<Text
						style={{
							color: Application.styles.secondary,
						}}
					>
						{departure_time}
					</Text>
					<MaterialCommunityIcons size={20} name="arrow-right-thick" />
				</Callout>
			</Marker>
		)
	}
	return (
		<Marker
			tracksViewChanges={false}
			anchor={{ x: 0.5, y: 0.96 }}
			zIndex={12}
			coordinate={{ latitude: parseFloat(bus.lat), longitude: parseFloat(bus.lng) }}
			flat={true}
			title={bus.plateNumber}
			rotation={parseFloat(bus.bearing)}
			className="items-center justify-center overflow-visible"
			calloutAnchor={{ x: 0.5, y: 0.8 }}
			onCalloutPress={() => {
				navigation.navigate("bus_details", { bus: bus })
			}}
		>
			<Image
				style={{
					objectFit: "fill",
				}}
				className="top-4 w-12 h-8 relative self-center -scale-y-100"
				source={{
					uri: `${DYNAMIC_CONTENT_URL}/assets/media/images/icons/bus_bearing_colored.png`,
				}}
			/>
			<MaterialCommunityIcons
				style={{
					backgroundColor: Application.styles.primary,
					elevation: 10,
					borderRadius: 50,
					padding: 2,
					color: Application.styles.white,
					transform: [{ rotateZ: "180deg" }],
				}}
				name="bus"
				size={16}
			/>
			{/* <View className="items-center" style={{ borderRadius: 8, backgroundColor: Application.styles.secondary, paddingHorizontal: 1 * 4 }}>
			<Text style={{ color: Application.styles.white, fontWeight: "800", fontSize: 12, maxWidth: 20 * 4, textAlign: "center" }} adjustsFontSizeToFit={true}>
				{bus.plateNumber}
			</Text>
		</View> */}
			<Callout className="flex-row items-center">
				<View className="flex-col items-center" style={{width:16*4}}>
					<Text
						style={{
							color: Application.styles.secondary,
							fontWeight:"800"
						}}
					>
						{bus.plateNumber}
					</Text>
					<Text
						style={{
							color: Application.styles.secondary,
						}}
					>
						{departure_time}
					</Text>
				</View>
				<MaterialCommunityIcons size={20} color={Application.styles.secondary} name="arrow-right-thick" />
			</Callout>
		</Marker>
	)
}
