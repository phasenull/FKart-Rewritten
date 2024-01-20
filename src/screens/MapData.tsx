import { Text, View } from "react-native"
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps"
import BasicRouteInformation from "../common/interfaces/BasicRouteInformation"
import BusData from "../common/interfaces/BusData"
import RouteData from "../common/interfaces/RouteData"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Application from "../common/Application"
import useGetCityData from "../common/hooks/useGetCityData"
import { useEffect, useState } from "react"
import { ICityInformation } from "../common/interfaces/CityInformation"
export default function MapData(props: {
	route: {
		params: {
			route_data: RouteData
			bus_list: BusData[]
		}
	}
}) {
	const { data: cityData } = useGetCityData()
	const { route_data, bus_list } = props.route?.params
	const [userCity, setUserCity] = useState<ICityInformation | undefined>(undefined)
	useEffect(() => {
		if (cityData?.data) {
			const user_region = Application.region
			const user_city = cityData.data.city.find((city) => city.id === user_region)
			setUserCity(user_city)
		}
	}, [cityData?.data])

	if (!route_data || !bus_list || !userCity) {
		return (
			<View>
				<Text>Map Data Error</Text>
				<Text>No route data found</Text>
			</View>
		)
	}

	return (
		<View className="flex-1">
			<MapView
				initialRegion={{
					latitude: parseFloat(userCity.initialRegion.lat),
					longitude: parseFloat(userCity.initialRegion.lng),
					longitudeDelta: 0.05,
					latitudeDelta: 0.05,
				}}
				provider={PROVIDER_GOOGLE}
				style={{ flex: 1 }}
			>
				{route_data.busStopList.map((busStop, index) => (
					<Marker style={{ alignItems: "center" }} key={index} coordinate={{ latitude: parseFloat(busStop.lat), longitude: parseFloat(busStop.lng) }} title={busStop.stopName}>
						<MaterialCommunityIcons name="bus-stop" size={30} color={Application.styles.secondary} />
						<Callout
							// tooltip={true}
							className="items-center"
							// style={{
							// 	backgroundColor: Application.styles.white,
							// 	borderRadius: 8,
							// 	paddingHorizontal: 1 * 4,
							// }}
						>
							<Text
								className="bg-red-400 w-24 h-16"
								style={{ color: Application.styles.secondary, fontWeight: "800", fontSize: 30, textAlign: "center" }}
								numberOfLines={1}
								// adjustsFontSizeToFit={true}
							>
								{busStop.stopName}
							</Text>
						</Callout>
					</Marker>
				))}
				{bus_list.map((bus, index) => (
					<Marker key={index} className="items-center" coordinate={{ latitude: parseFloat(bus.lat), longitude: parseFloat(bus.lng) }} title={bus.plateNumber}>
						<View className="items-center bg-white" style={{ borderRadius: 8, paddingHorizontal: 1 * 4 }}>
							<Text style={{ color: Application.styles.primary, fontWeight: "800", fontSize: 12, maxWidth: 20 * 4, textAlign: "center" }} adjustsFontSizeToFit={true}>
								{bus.plateNumber}
							</Text>
						</View>
						<MaterialCommunityIcons
							style={{
								transform: [{ rotateZ: `${parseFloat(bus.bearing)}deg` }],
							}}
							name="bus"
							size={30}
							color={Application.styles.primary}
						/>
					</Marker>
				))}
			</MapView>
		</View>
	)
}
