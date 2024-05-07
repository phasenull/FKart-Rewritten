import { LegacyRef, useMemo } from "react"
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps"
import { ICityInformation } from "../../common/interfaces/KentKart/object/CityInformation"
import RouteData from "../../common/interfaces/KentKart/object/RouteData"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Application from "../../common/Application"
import BusData from "../../common/interfaces/KentKart/object/BusData"
import { Image, Text, View } from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { DYNAMIC_CONTENT_URL } from "../../common/constants"
import Logger from "../../common/Logger"
import StopMarker from "./markers/StopMarker"
import {BusMarker} from "./markers/BusMarker"
const styled_map = require("./MapStyle.json")
export default function Map(props: {
	forwardRef: LegacyRef<MapView> | undefined
	userCity: ICityInformation
	routeDataToShow: RouteData
	busListToShow: BusData[]
	navigation: NativeStackNavigationProp<any>
	easterEggEnabled?: boolean
}) {
	const { forwardRef, routeDataToShow, userCity, easterEggEnabled, busListToShow, navigation } = props
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
				customMapStyle={easterEggEnabled?styled_map:[]}
				provider={PROVIDER_GOOGLE}
				style={{ flex: 1 }}
			>
				<Polyline
					coordinates={routeDataToShow.pointList.map((e) => ({
						latitude: parseFloat(e.lat),
						longitude: parseFloat(e.lng),
					}))}
					strokeColor={easterEggEnabled ? "#fff": Application.styles.primaryDark}
					strokeWidth={5}
				/>
				{routeDataToShow.busStopList.map((busStop, index) => (
					<StopMarker
						busStop={busStop}
						key={index.toString()}
						easterEggEnabled={easterEggEnabled}
						coordinate={{ latitude: parseFloat(busStop.lat), longitude: parseFloat(busStop.lng) }}
						navigation={navigation}
					/>
				))}

				{busListToShow.map((bus, index) => (
					<BusMarker route_data={routeDataToShow} bus={bus} key={index.toString()} easterEggEnabled={easterEggEnabled} coordinate={{ latitude: parseFloat(bus.lat), longitude: parseFloat(bus.lng) }} navigation={navigation} />
				))}
			</MapView>
		)
	}, [busListToShow, routeDataToShow, userCity, easterEggEnabled])
}
