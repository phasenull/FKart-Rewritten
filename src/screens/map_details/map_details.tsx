import { Clipboard, Text, ToastAndroid, Vibration, View } from "react-native"
import MapView from "react-native-maps"
import BusData from "common/interfaces/KentKart/BusData"
import RouteData from "common/interfaces/KentKart/RouteData"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Application from "common/Application"
import useGetCityData from "common/hooks/kentkart/info/useGetCityData"
import React, { LegacyRef, Ref, useContext, useEffect, useRef, useState } from "react"
import { ICityInformation } from "common/interfaces/KentKart/CityInformation"
import BottomSheet, { TouchableOpacity } from "@gorhom/bottom-sheet"
import { DYNAMIC_CONTENT_URL } from "common/constants"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ScrollView } from "react-native-gesture-handler"
import BusContainer from "screens/route_details/BusContainer"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import Map from "./Map"
import useGetRouteDetails from "common/hooks/kentkart/info/useGetRouteDetails"
import CustomLoadingIndicator from "components/root/CustomLoadingIndicator"
import FollowingBus from "./FollowingBus"
import { ThemeContext } from "common/contexts/ThemeContext"
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
	const {theme} = useContext(ThemeContext)
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
				color: theme.secondary,
				fontWeight: "900",
			},
		})
		const init_bus = props.route.params.initial_bus
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
		const path_list = fetchedRouteData?.data?.pathList
		if (path_list && path_list[0]) {
			setRouteDataToShow(path_list[0])
			const bus_list = path_list[0].busList
			setBusListToShow(path_list[0].busList)
			if (!bus_list || bus_list.length === 0) return
			if (!followingBus) return
			const found_bus = path_list[0].busList.find((bus: BusData) => bus.plateNumber === followingBus.plateNumber)
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
	const pressCounter = useRef({ last_press: 0, press_count: 0 })

	useEffect(() => {
		if (cityData?.data) {
			const user_region = Application.region
			const user_city = cityData.data.city.find((city) => city.id === user_region)
			setUserCity(user_city)
		}
	}, [cityData?.data])
	function pressForEasterEgg() {
		pressCounter.current.press_count++
		if (pressCounter.current.press_count === 1) {
			pressCounter.current.last_press = Date.now()
		}
		if (pressCounter.current.press_count >= 2) {
			if (Date.now() - pressCounter.current.last_press < 500) {
				pressCounter.current.press_count = 0
				pressCounter.current.last_press = Date.now()
				console.log("new easter egg enabled", !easterEggEnabled)
				Vibration.vibrate(500)
				ToastAndroid.show(`Easter Egg ${!easterEggEnabled ? "Enabled" : "Disabled"}`, ToastAndroid.SHORT)
				setEasterEggEnabled(!easterEggEnabled)
			} else {
				pressCounter.current.press_count = 0
				pressCounter.current.last_press = Date.now()
			}
		}
	}
	const [easterEggEnabled, setEasterEggEnabled] = useState(false)
	if (!routeDataToShow || !busListToShow || !userCity) {
		return <CustomLoadingIndicator />
	}
	return (
		<View className="flex-1">
			<Map easterEggEnabled={easterEggEnabled} busListToShow={busListToShow} navigation={navigation} forwardRef={ref_map_view as LegacyRef<MapView>} routeDataToShow={routeDataToShow} userCity={userCity} />
			<FollowingBus style={{ position: "absolute", marginTop: 2 * 4 }} bus={followingBus} onStopFollowing={() => setFollowingBus(undefined)} />

			<BottomSheet
				ref={ref_bottom_sheet as Ref<BottomSheetMethods>}
				backgroundStyle={{
					backgroundColor: theme.dark,
				}}
				snapPoints={["12%", "35%", "90%"]}
				index={1}
				enablePanDownToClose={false}
			>
				<View style={{ marginHorizontal: 4 * 4 }} className="px-2 self-center w-full flex-row justify-between items-center h-12">
					<Text style={{ fontWeight: "600", maxWidth: "90%", color: theme.secondary }}>{routeDataToShow.headSign}</Text>
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
									backgroundColor: theme.secondary,
									padding: 5,
								}}
								color={theme.white}
								size={30}
								name="arrow-left-right"
							/>
							{/* <Text className="w-10 text-center" adjustsFontSizeToFit={true} numberOfLines={2}>Switch Direction</Text> */}
						</TouchableOpacity>
					)}
				</View>
				<ScrollView
					style={{
						maxHeight: 48 * 4,
					}}
					horizontal={true}
					contentContainerStyle={{
						paddingHorizontal: 20,
						columnGap: 20,
					}}
				>
					{busListToShow.map((bus: BusData) => (
						<BusContainer
							onLongPress={() => {
								Clipboard.setString(`https://deep.fkart.project.phasenull.dev/route_details/${routeDataToShow.displayRouteCode}/${direction}/${bus.busId}`)
								ToastAndroid.show("Link kopyalandı!", ToastAndroid.SHORT)
								Vibration.vibrate(100)
							}}
							onPress={() => {
								pressForEasterEgg()
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
				<Text className="self-center absolute bottom-0">Hello</Text>
			</BottomSheet>
		</View>
	)
}
