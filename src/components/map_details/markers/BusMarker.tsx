import Logger from "common/Logger"
import { DYNAMIC_CONTENT_URL } from "common/constants"
import { ThemeContext } from "common/contexts/ThemeContext"
import BusData from "common/interfaces/KentKart/BusData"
import RouteData from "common/interfaces/KentKart/RouteData"
import { router } from "expo-router"
import { transit_realtime } from "gtfs-realtime-bindings"
import { useContext } from "react"
import { Image } from "react-native"
import { Callout, LatLng, Marker } from "react-native-maps"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { BusCallout } from "../callouts/BusCallout"
import ApplicationConfig from "common/ApplicationConfig"
export function BusMarker(props: {
	is_rt?: boolean
	rt_raw?: transit_realtime.FeedEntity
	bus: BusData
	coordinate: LatLng
	easterEggEnabled?: boolean
	route_data?: RouteData,
	force_color?: string
}) {
	const { route_data, bus, coordinate, easterEggEnabled,force_color } = props
	const schedule_list = route_data?.timeTableList
	const scheduled_data = schedule_list?.find((e) => e.tripId === bus.tripId)
	const { theme } = useContext(ThemeContext)
	if (!bus || !coordinate || !route_data) {
		Logger.warning("BusMarker.tsx", "BusMarker", "Bus or coordinate is null")
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
				// calloutAnchor={{ x: 0.5, y: 0.5 }}
				// calloutOffset={{x:0.5,y:0.5}}
				coordinate={coordinate}
				title={bus.plateNumber}
				onCalloutPress={() => {
					router.navigate({ pathname: "/bus_details", params: { bus64: btoa(escape(JSON.stringify(bus))) } })
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
				<Callout
					removeClippedSubviews={false}
					style={{
						overflow: "visible",
						// minWidth: (props.is_rt ? 24 : 30) * 4,
						// minHeight: (props.is_rt ? 24 : 12) * 4,
					}}
					tooltip={true}
				>
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
				router.navigate({ pathname: "/bus_details", params: { bus64: btoa(escape(JSON.stringify(bus))) } })

			}}
		>
			<Image
				style={{
					objectFit: "fill",
				}}
				className="top-4 w-12 h-8 relative self-center -scale-y-100"
				source={require("assets/media/images/bus_bearing_colored.png")}
			/>
			<MaterialCommunityIcons
				style={{
					backgroundColor: force_color||getColorFromBus(props.rt_raw || props.bus, props.route_data) || theme.primary,
					elevation: 10,
					borderRadius: 50,
					padding: 2,
					color: theme.white,
					transform: [{ rotateZ: "180deg" }],
				}}
				name="bus"
				size={16}
			/>
			<Callout removeClippedSubviews={false} style={{ overflow: "visible" }} tooltip={true}>
				<BusCallout raw={props.rt_raw} is_rt={props.is_rt} bus={bus} route_data={route_data} scheduled_data={scheduled_data} />
			</Callout>
		</Marker>
	)
}
function getColorFromBus(bus: any, route_data?: RouteData) {
	if (["41K", "41041"].includes(route_data?.displayRouteCode || "")) return "#33aaff"
	if (route_data?.tripShortName.includes("GÖREVLİ") || route_data?.tripShortName.includes("SERVİS DIŞI")) return "#38fb00"
	if ((bus.plateNumber || bus.vehicle?.vehicle?.licensePlate)?.includes("ATT")) return "#cf00fb"
	if ((bus.plateNumber || bus.vehicle?.vehicle?.licensePlate)?.startsWith("34 ")) return "#000"
	if ((route_data?.displayRouteCode)?.includes("KM") || (route_data?.path_code)?.startsWith("51")) return "#fb5100"
}
