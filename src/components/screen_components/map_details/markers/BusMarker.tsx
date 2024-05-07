import { Callout, LatLng, Marker } from "react-native-maps"
import BusData from "../../../../common/interfaces/KentKart/object/BusData"
import { Image, Text, View } from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { DYNAMIC_CONTENT_URL } from "../../../../common/constants" 
import Application from "../../../../common/Application" 
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Logger from "../../../../common/Logger"
import RouteData from "../../../../common/interfaces/KentKart/object/RouteData" 
import { BusCallout } from "../callouts/BusCallout"

export function BusMarker(props: { bus: BusData; coordinate: LatLng; easterEggEnabled?: boolean; navigation: NativeStackNavigationProp<any>; route_data?: RouteData }) {
	const { route_data, bus, coordinate, easterEggEnabled, navigation } = props
	const schedule_list = route_data?.timeTableList
	const scheduled_data = schedule_list?.find((e) => e.tripId === bus.tripId)
	if (!bus || !coordinate || !navigation || !route_data) {
		Logger.warning("BusMarker.tsx", "BusMarker", "Bus, coordinate or navigation is null")
		return
	}
	if (easterEggEnabled) {
		return (
			<Marker
				tracksViewChanges={false}
				anchor={{ x: 0.5, y: 0.7 }}
				style={{ alignItems: "center", overflow: "visible" }}
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
					source={{ uri: `${DYNAMIC_CONTENT_URL}/assets/media/images/random/easter_eggs/pacman/character_0.png`, cache: "force-cache" }}
					className="h-8 w-8 -rotate-90"
				/>
				<Callout removeClippedSubviews={false} style={{ overflow: "visible" }} tooltip={true}>
					<BusCallout bus={bus} route_data={route_data} scheduled_data={scheduled_data} />
				</Callout>
			</Marker>
		)
	}
	return (
		<Marker
			tracksViewChanges={false}
			anchor={{ x: 0.5, y: 0.5 }}
			zIndex={12}
			key={bus.plateNumber}
			coordinate={{ latitude: parseFloat(bus.lat), longitude: parseFloat(bus.lng) }}
			flat={true}
			title={bus.plateNumber}
			rotation={parseFloat(bus.bearing)}
			className="items-center justify-center overflow-visible"
			// calloutOffset={{x:1,y:1}}
			calloutAnchor={{ x: 0.5, y: 0.5 }}
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
					cache: "force-cache",
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
			<Callout removeClippedSubviews={false} style={{ overflow: "visible" }} tooltip={true}>
				<BusCallout bus={bus} route_data={route_data} scheduled_data={scheduled_data} />
			</Callout>
		</Marker>
	)
}
