import { Clipboard, Image, Text, View } from "react-native"
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps"
import BasicRouteInformation from "../common/interfaces/BasicRouteInformation"
import BusData from "../common/interfaces/BusData"
import RouteData from "../common/interfaces/RouteData"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Application from "../common/Application"
import useGetCityData from "../common/hooks/useGetCityData"
import React, { LegacyRef, Ref, useEffect, useRef, useState } from "react"
import { ICityInformation } from "../common/interfaces/CityInformation"
import IPoint from "../common/interfaces/Point"
import BasicStopInformation from "../common/interfaces/BasicStopInformation"
import BottomSheet, { TouchableOpacity } from "@gorhom/bottom-sheet"
import { DYNAMIC_CONTENT_URL } from "../common/constants"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ScrollView } from "react-native-gesture-handler"
import BusContainer from "../components/route_details/BusContainer"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import Map from "../components/map_details/Map"
import useGetRouteDetails from "../common/hooks/useGetRouteDetails"
import CustomLoadingIndicator from "../components/CustomLoadingIndicator"
import FollowingBus from "../components/map_details/FollowingBus"
export default function MapData(props: {
	route: {
		params: {
			route_data: RouteData
			bus_list: BusData[]
			initial_bus?: BusData
		}
	}
	navigation: NativeStackNavigationProp<any>
}) {
	const ref_map_view = useRef<MapView>()
	const ref_bottom_sheet = useRef<BottomSheet>()
	const { data: cityData } = useGetCityData()
	const [busListToShow, setBusListToShow] = useState<BusData[]>(props?.route?.params?.bus_list)
	const [routeDataToShow, setRouteDataToShow] = useState<RouteData>(props?.route?.params?.route_data)
	const { navigation } = props
	const [userCity, setUserCity] = useState<ICityInformation | undefined>(undefined)
	const [direction, setDirection] = useState(routeDataToShow.direction)
	const {
		data: fetchedRouteData,
		isRefetching: isRouteRefetching,
		refetch: refetchRouteData,
	} = useGetRouteDetails({ direction: direction, route_code: routeDataToShow.displayRouteCode, include_time_table: true, interval: 5000 })
	const [followingBus, setFollowingBus] = useState<BusData | undefined>(props?.route?.params?.initial_bus)
	useEffect(() => {
		refetchRouteData()
	}, [direction])
	useEffect(() => {
		navigation.setOptions({
			title: `Route ${props.route.params.route_data.displayRouteCode} - Map View`,
			headerTitleStyle: {
				color: Application.styles.secondary,
				fontWeight: "900",
			},
		})
		const init_bus =props.route.params.initial_bus
		if (init_bus) {
			ref_map_view.current?.animateToRegion({
				latitude: parseFloat(init_bus.lat) - 0.001,
				longitude: parseFloat(init_bus.lng),
				latitudeDelta: 0.005,
				longitudeDelta: 0.005,
			})
		}
	}, [])
	useEffect(() => {
		if (fetchedRouteData?.data?.pathList[0]) {
			setRouteDataToShow(fetchedRouteData.data.pathList[0])
			setBusListToShow(fetchedRouteData.data.pathList[0].busList)

			if (!followingBus) return
			const found_bus = fetchedRouteData.data.pathList[0].busList.find((bus: BusData) => bus.plateNumber === followingBus.plateNumber)
			if (!found_bus) return
			console.log("Following bus found")
			ref_map_view.current?.animateToRegion({
				latitude: parseFloat(found_bus.lat) - 0.001,
				longitude: parseFloat(found_bus.lng),
				latitudeDelta: 0.005,
				longitudeDelta: 0.005,
			})
			setFollowingBus(found_bus)
		}
	}, [fetchedRouteData])
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
			<Map busListToShow={busListToShow} navigation={navigation} forwardRef={ref_map_view as LegacyRef<MapView>} routeDataToShow={routeDataToShow} userCity={userCity} />
			<FollowingBus style={{ position: "absolute", marginTop: 2 * 4 }} bus={followingBus} onStopFollowing={() => setFollowingBus(undefined)} />

			<BottomSheet
				containerStyle={{ overflow: "visible" }}
				ref={ref_bottom_sheet as Ref<BottomSheetMethods>}
				backgroundStyle={{
					backgroundColor: Application.styles.dark,
					overflow: "visible",
				}}
				handleStyle={{
					overflow: "visible",
				}}
				style={{ overflow: "visible" }}
				enableOverDrag={true}
				snapPoints={["12%", "35%", "90%"]}
				index={1}
			>
				<View style={{ marginHorizontal: 4 * 4 }} className="px-2 self-center w-full flex-row justify-between items-center h-12">
					<Text style={{ fontWeight: "600", maxWidth: "90%", color: Application.styles.secondary }}>{routeDataToShow.headSign}</Text>
					{isRouteRefetching ? (
						<CustomLoadingIndicator size={20} style={{ marginHorizontal: 0, marginVertical: 5, marginRight: 12 }} />
					) : (
						<TouchableOpacity
							onPress={() => {
								setDirection(1 - direction)
							}}
							className="flex-col"
						>
							<MaterialCommunityIcons
								style={{
									borderRadius: 40,
									backgroundColor: Application.styles.secondary,
									padding: 5,
								}}
								color={Application.styles.white}
								size={30}
								name="arrow-left-right"
							/>
							{/* <Text className="w-10 text-center" adjustsFontSizeToFit={true} numberOfLines={2}>Switch Direction</Text> */}
						</TouchableOpacity>
					)}
				</View>
				<ScrollView
					horizontal={true}
					contentContainerStyle={{
						paddingHorizontal: 20,
						columnGap: 20,
					}}
					className="w-full"
				>
					{busListToShow.map((bus: BusData) => (
						<BusContainer
							onLongPress={() => {
								Clipboard.setString(`https://deep.fkart.project.phasenull.dev/route_details/${routeDataToShow.displayRouteCode}/${direction}/${bus.busId}`)
							}}
							onPress={() => {
								ref_map_view.current?.animateToRegion({
									latitude: parseFloat(bus.lat) - 0.001,
									longitude: parseFloat(bus.lng),
									latitudeDelta: 0.005,
									longitudeDelta: 0.005,
								})
								setFollowingBus(bus)
								ref_bottom_sheet.current?.snapToIndex(1)
							}}
							route_data={routeDataToShow}
							navigation={navigation}
							bus={bus}
							key={`BusContainer-${bus.plateNumber}`}
						/>
					))}
				</ScrollView>
				<Text className="self-center mb-4">Hello</Text>
			</BottomSheet>
		</View>
	)
}
