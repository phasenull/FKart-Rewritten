import { Image, Text, View } from "react-native"
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps"
import BasicRouteInformation from "../common/interfaces/BasicRouteInformation"
import BusData from "../common/interfaces/BusData"
import RouteData from "../common/interfaces/RouteData"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Application from "../common/Application"
import useGetCityData from "../common/hooks/useGetCityData"
import React, { LegacyRef, useEffect, useRef, useState } from "react"
import { ICityInformation } from "../common/interfaces/CityInformation"
import IPoint from "../common/interfaces/Point"
import BasicStopInformation from "../common/interfaces/BasicStopInformation"
import BottomSheet from "@gorhom/bottom-sheet"
import { DYNAMIC_CONTENT_URL } from "../common/constants"
export default function MapData(props: {
	route: {
		params: {
			route_data: RouteData
			bus_list: BusData[]
		}
	}
}) {
	const ref_map_view = useRef<MapView>()
	const { data: cityData } = useGetCityData()
	const { route_data, bus_list } = props.route?.params
	const [busListToShow, setBusListToShow] = useState<BusData[]>(bus_list)
	const [routeDataToShow, setRouteDataToShow] = useState<RouteData>(route_data)

	const [userCity, setUserCity] = useState<ICityInformation | undefined>(undefined)
	useEffect(() => {
		if (cityData?.data) {
			const user_region = Application.region
			const user_city = cityData.data.city.find((city) => city.id === user_region)
			setUserCity(user_city)
		}
	}, [cityData?.data])

	if (!routeDataToShow || !busListToShow || !userCity) {
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
				ref={ref_map_view as LegacyRef<MapView>}
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
					<Marker anchor={{ x: 0.5, y: 0.5 }} style={{ alignItems: "center" }} key={index} coordinate={{ latitude: parseFloat(busStop.lat), longitude: parseFloat(busStop.lng) }} title={busStop.stopName}>
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
						anchor={{ x: 0.5, y: 0.9}}
						key={index}
						zIndex={12}
						coordinate={{ latitude: parseFloat(bus.lat), longitude: parseFloat(bus.lng) }}
						flat={true}
						title={bus.plateNumber}
						rotation={parseFloat(bus.bearing)}
						className="items-center justify-center overflow-visible"
					>

						<Image
							style={{ objectFit: "fill" }}
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
								transform: [{ rotateZ: "180deg"}]
							}}
							name="bus"
							size={16}
							/>
						<View className="items-center" style={{ borderRadius: 8, backgroundColor: Application.styles.secondary, paddingHorizontal: 1 * 4 }}>
							<Text style={{ color: Application.styles.white, fontWeight: "800", fontSize: 12, maxWidth: 20 * 4, textAlign: "center" }} adjustsFontSizeToFit={true}>
								{bus.plateNumber}
							</Text>
						</View>
					</Marker>
				))}
			</MapView>
			<BottomSheet snapPoints={["5%", "25%", "50%", "70%", "100%"]}>
				<View className="flex-1 bg-red-400">
					<Text>Bottom Sheet</Text>
				</View>
			</BottomSheet>
		</View>
	)
}
