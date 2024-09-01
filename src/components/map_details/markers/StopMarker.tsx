import { Callout, LatLng, Marker } from "react-native-maps"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import BasicStopInformation from "common/interfaces/KentKart/BasicStopInformation"
import { Image, Text, View } from "react-native"
import { DYNAMIC_CONTENT_URL } from "common/constants"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import Logger from "common/Logger"
import { useContext } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"

export default function StopMarker(props: { busStop: BasicStopInformation; coordinate: LatLng; easterEggEnabled?: boolean }) {
	const { busStop, coordinate, easterEggEnabled } = props
	const { theme } = useContext(ThemeContext)

	if (!busStop || !coordinate) {
		Logger.warning("StopMarker.tsx", "StopMarker", "BusStop, coordinate or navigation is null")
		return
	}
	if (easterEggEnabled) {
		return (
			<Marker tracksViewChanges={false} anchor={{ x: 0.5, y: 0.5 }} style={{ alignItems: "center" }} coordinate={coordinate} title={busStop.stopName}>
				<Image
					style={{
						objectFit: "fill",
					}}
					source={{ uri: `${DYNAMIC_CONTENT_URL}/assets/media/images/random/easter_eggs/pacman/coin.png` }}
					className="h-4 w-4"
				/>
			</Marker>
		)
	}
	return (
		<Marker key={busStop.stopId}  tracksViewChanges={false} style={{ alignItems: "center" }} coordinate={coordinate} title={`+${new Date(parseInt(busStop.arrival_offset || "0") * 1000).getMinutes()}m ${busStop.stopName}`}>
			<View className="h-8 w-8 justify-center items-center">
			<MaterialCommunityIcons name="bus-stop" size={22} color={theme.secondary} />

			</View>
			{/* <Callout
				// tooltip={true}
				// className="min-w-48"
				style={{
					backgroundColor: theme.white,
					borderRadius: 8,
					paddingHorizontal: 1 * 4,
					width: 16 * 4 + (busStop.stopName || "").length * 4,
				}}
			> */}
			{/* </Callout> */}
		</Marker>
	)
}