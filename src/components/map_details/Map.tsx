import { ThemeContext } from "common/contexts/ThemeContext"
import BusData from "common/interfaces/KentKart/BusData"
import { ICityInformation } from "common/interfaces/KentKart/CityInformation"
import RouteData from "common/interfaces/KentKart/RouteData"
import { LegacyRef, useContext, useMemo } from "react"
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps"
import { BusMarker } from "./markers/BusMarker"
import StopMarker from "./markers/StopMarker"
const styled_map = require("./MapStyle.json")
export default function Map(props: {
	forwardRef: LegacyRef<MapView> | undefined
	userCity: ICityInformation
	routeDataToShow: RouteData
	busListToShow: BusData[]
	easterEggEnabled?: boolean
}) {
	const {theme} = useContext(ThemeContext)
	const { forwardRef, routeDataToShow, userCity, easterEggEnabled, busListToShow } = props
	return useMemo(() => {
		// Logger.info("Map.tsx", "Map", "Rendering Map")
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
					strokeColor={easterEggEnabled ? "#fff": theme.primaryDark}
					strokeWidth={5}
				/>
				{routeDataToShow.busStopList.map((busStop, index) => (
					<StopMarker
						busStop={busStop}
						key={index.toString()}
						easterEggEnabled={easterEggEnabled}
						coordinate={{ latitude: parseFloat(busStop.lat), longitude: parseFloat(busStop.lng) }}
					/>
				))}

				{busListToShow.map((bus, index) => (
					<BusMarker route_data={routeDataToShow} bus={bus} key={index.toString()} easterEggEnabled={easterEggEnabled} coordinate={{ latitude: parseFloat(bus.lat), longitude: parseFloat(bus.lng) }}  />
				))}
			</MapView>
		)
	}, [busListToShow, routeDataToShow, userCity, easterEggEnabled])
}
