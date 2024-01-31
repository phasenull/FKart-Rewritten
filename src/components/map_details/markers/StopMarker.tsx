import { LatLng, Marker } from "react-native-maps"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import BasicStopInformation from "../../../common/interfaces/BasicStopInformation"
import Application from "../../../common/Application"
import { Image } from "react-native"
import { DYNAMIC_CONTENT_URL } from "../../../common/constants"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import Logger from "../../../common/Logger"

export default function StopMarker(props: { busStop: BasicStopInformation; coordinate: LatLng; easterEggEnabled?: boolean; navigation: NativeStackNavigationProp<any> }) {
	const { busStop, coordinate, easterEggEnabled, navigation } = props
	if (!busStop || !coordinate || !navigation) {
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
		<Marker tracksViewChanges={false} anchor={{ x: 0.5, y: 0.5 }} style={{ alignItems: "center" }} coordinate={coordinate} title={busStop.stopName}>
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
	)
}
