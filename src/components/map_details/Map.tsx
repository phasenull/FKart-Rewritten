import { LegacyRef, useMemo } from "react"
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps"
import { ICityInformation } from "../../common/interfaces/CityInformation"
import RouteData from "../../common/interfaces/RouteData"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Application from "../../common/Application"
import BusData from "../../common/interfaces/BusData"
import { Image, Text, View } from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { DYNAMIC_CONTENT_URL } from "../../common/constants"
import Logger from "../../common/Logger"

export default function Map(props: {
	forwardRef: LegacyRef<MapView> | undefined
	userCity: ICityInformation
	routeDataToShow: RouteData
	busListToShow: BusData[]
	navigation: NativeStackNavigationProp<any>
}) {
	const { forwardRef, routeDataToShow, userCity, busListToShow, navigation } = props
	return useMemo(() => {
		Logger.info("Map.tsx", "Map", "Rendering Map")
		return (
			<MapView
				ref={forwardRef}
				initialRegion={{
					latitude: parseFloat(userCity.initialRegion.lat),
					longitude: parseFloat(userCity.initialRegion.lng),
					longitudeDelta: 0.05,
					latitudeDelta: 0.05,
				}}
				provider={PROVIDER_GOOGLE}
				style={{ flex: 1 }}
			>
				<Polyline
					coordinates={routeDataToShow.pointList.map((e) => ({
						latitude: parseFloat(e.lat),
						longitude: parseFloat(e.lng),
					}))}
					strokeColor={Application.styles.primaryDark}
					strokeWidth={5}
				/>
				{routeDataToShow.busStopList.map((busStop, index) => (
					<Marker
						tracksViewChanges={false}
						anchor={{ x: 0.5, y: 0.5 }}
						style={{ alignItems: "center" }}
						key={index}
						coordinate={{ latitude: parseFloat(busStop.lat), longitude: parseFloat(busStop.lng) }}
						title={busStop.stopName}
					>
						<MaterialCommunityIcons name="bus-stop" size={22} color={Application.styles.secondary} />
						{/* <Callout
						// tooltip={true}
						className=" w-48"
						// style={{
						// 	backgroundColor: Application.styles.white,
						// 	borderRadius: 8,
						// 	paddingHorizontal: 1 * 4,
						// }}
					>
						<Text
							className="w-48"
							style={{ color: Application.styles.secondary, fontWeight: "800", fontSize: 15, textAlign: "center" }}
							// numberOfLines={1}
							// adjustsFontSizeToFit={true}
						>
							{busStop.stopName}
						</Text>
					</Callout> */}
					</Marker>
				))}


				{busListToShow.map((bus, index) => (
					<Marker
						removeClippedSubviews={false}
						tracksViewChanges={false}
						anchor={{ x: 0.5, y: 0.96 }}
						key={bus.plateNumber}
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
							source={{ uri: `${DYNAMIC_CONTENT_URL}/assets/media/images/icons/bus_bearing_colored.png` }}
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
							<Text
								style={{
									color: Application.styles.secondary,
								}}
							>
								{bus.plateNumber}
							</Text>
							<MaterialCommunityIcons size={20} style={{}} name="arrow-right-thick" />
						</Callout>
					</Marker>
				))}
			</MapView>
		)
	}, [busListToShow, routeDataToShow, userCity])
}
