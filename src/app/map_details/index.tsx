import { Clipboard, Text, ToastAndroid, Vibration, View } from "react-native"
import MapView from "react-native-maps"
import BusData from "common/interfaces/KentKart/BusData"
import RouteData from "common/interfaces/KentKart/RouteData"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import ApplicationConfig from "common/ApplicationConfig"

import React, { LegacyRef, Ref, useContext, useEffect, useRef, useState } from "react"
import { ICityInformation } from "common/interfaces/KentKart/CityInformation"
import BottomSheet, { TouchableOpacity } from "@gorhom/bottom-sheet"
import { DYNAMIC_CONTENT_URL } from "common/constants"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ScrollView } from "react-native-gesture-handler"
import BusContainer from "../route_details/BusContainer"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import Map from "./Map"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"

import FollowingBus from "./FollowingBus"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetCityList, useGetRouteDetails } from "common/hooks/kentkart/nonAuthHooks"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import { router, Stack, useLocalSearchParams } from "expo-router"
export default function MapData() {
	const { force_route_code, force_direction, force_bus_id,headerTitle } = useLocalSearchParams<{
		force_direction: string
		force_bus_id: string
		force_route_code: string
		headerTitle:string
	}>()
	const ref_map_view = useRef<MapView>()
	const ref_bottom_sheet = useRef<BottomSheet>()
	const user = useKentKartAuthStore((state) => state.user)
	const { data: cityData } = useGetCityList()
	const [busListToShow, setBusListToShow] = useState<BusData[]>()
	const [routeDataToShow, setRouteDataToShow] = useState<RouteData>()
	const [userCity, setUserCity] = useState<ICityInformation | undefined>(undefined)
	const [direction, setDirection] = useState(parseInt(force_direction) || 0)
	const { theme } = useContext(ThemeContext)
	const {
		data: fetchedRouteData,
		isRefetching: isRouteRefetching,
		refetch: refetchRouteData,
	} = useGetRouteDetails({
		direction: direction,
		route_code: force_route_code,
		interval: 5000,
		user: user as IKentKartUser,
		result_includes: {
			busStopList: true,
			busList: true,
			scheduleList: false,
			timeTableList: true,
			pointList: true,
		},
	})
	const [followingBus, setFollowingBus] = useState<BusData | undefined>(force_bus_id && {busId:force_bus_id} as any)
	useEffect(() => {
		const path_list = fetchedRouteData?.data?.pathList
		if (path_list && path_list[0]) {
			setRouteDataToShow(path_list[0])
			const bus_list = path_list[0].busList
			setBusListToShow(path_list[0].busList)
			if (!bus_list || bus_list.length === 0) return
			if (!followingBus) return
			const found_bus = path_list[0].busList.find((bus: BusData) => bus.busId === followingBus.busId)
			if (!found_bus) return
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
			const user_region = ApplicationConfig.region
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
			<Stack.Screen
				options={{
					headerShown:true,
					title: headerTitle || `Route ${force_route_code} - Map View`,
					headerTitleStyle: {
						color: theme.secondary,
						fontWeight: "900",
					},
				}}
			/>
			<Map easterEggEnabled={easterEggEnabled} busListToShow={busListToShow} forwardRef={ref_map_view as LegacyRef<MapView>} routeDataToShow={routeDataToShow} userCity={userCity} />
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
								Clipboard.setString(`fkart://map_details?force_route_code=${routeDataToShow.displayRouteCode}&force_direction=${direction}&force_bus_id=${bus.busId}`)
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
