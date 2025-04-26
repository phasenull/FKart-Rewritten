import ApplicationConfig from "common/ApplicationConfig"
import BusData from "common/interfaces/KentKart/BusData"
import RouteData from "common/interfaces/KentKart/RouteData"
import { Clipboard, Text, ToastAndroid, Vibration, View } from "react-native"
import MapView from "react-native-maps"

import BottomSheet, { TouchableOpacity } from "@gorhom/bottom-sheet"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { ICityInformation } from "common/interfaces/KentKart/CityInformation"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import React, { LegacyRef, Ref, useContext, useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import Map from "../../components/map_details/Map"
import BusContainer from "../../components/reusables/BusContainer"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetCityList, useGetRouteDetails } from "common/hooks/kentkart/nonAuthHooks"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import Logger from "common/Logger"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import HorizontalDivider from "components/reusables/HorizontalDivider"
import SecondaryText from "components/reusables/SecondaryText"
import { router, Stack, useLocalSearchParams } from "expo-router"
import FollowingBus from "../../components/map_details/FollowingBus"
import { useQueries } from "react-query"
import { groupBy } from "common/util"
export default function MapData() {
	const { force_route_code, force_direction, force_bus_id, headerTitle } = useLocalSearchParams<{
		force_direction: string
		force_bus_id: string
		force_route_code: string
		headerTitle: string
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
		isError,
		error,
	} = useGetRouteDetails({
		direction: direction,
		route_code: force_route_code,
		interval: 5 * 1_000, //dev
		user: user as IKentKartUser,
		result_includes: {
			busStopList: true,
			busList: true,
			scheduleList: false,
			timeTableList: true,
			pointList: true,
		},
	})
	if (isError) {
		Logger.warning("map_details.tsx", "route details fetch error", (error as any).data)
	}
	const [followingBus, setFollowingBus] = useState<BusData | undefined>(force_bus_id && ({ busId: force_bus_id } as any))
	useEffect(() => {
		const path_list = fetchedRouteData?.data?.pathList
		if (path_list && path_list[0]) {
			setRouteDataToShow(path_list[0])
			const bus_list = path_list[0].busList
			setBusListToShow(bus_list)
			if (!bus_list || bus_list.length === 0) return
			if (!followingBus) return
			const found_bus = bus_list?.find((bus: BusData) => bus.busId === followingBus.busId)
			if (!found_bus) return
			ref_map_view.current?.animateToRegion({
				latitude: parseFloat(found_bus.lat) - 0.001,
				longitude: parseFloat(found_bus.lng),
				latitudeDelta: 0.02,
				longitudeDelta: 0.02,
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
	const results = useQueries(
		routeDataToShow?.busList.map((e) => ({
			queryKey: ["search-bus", e.busId.split("|")[0]],
			queryFn: async () => {
				const vehicle_id = (e.busId.split("|")[0].replaceAll(".", "").replaceAll("/", ""))
				const API = await ApplicationConfig.database.get("kk_vts_api")
				const url = `${API}/api/events/search?key=bus&value=${vehicle_id}`
				if (!API) router.navigate({ pathname: "/AppData", params: { fill_key: "kk_vts_api" } })
				const response = await fetch(url)
				const json = await response.json()
				console.log("getVehicleEvents", e.busId.split("|")[0], json?.data?.length)
				return {
					vehicle_id: vehicle_id, events: json?.data as {
						"created_at": string,
						"license_plate": string,
						"vehicle_id": number,
						"trip_id": number,
						"route_code": number,
						"direction": 0 | 1,
						"event_label": string
					}[]
				}
			},
			cacheTime: 10 * 60 * 1000,
			staleTime: 1 * 60 * 1000,
		})) || [])
	const [easterEggEnabled, setEasterEggEnabled] = useState(false)
	if (!routeDataToShow || !busListToShow || !userCity) {
		return <CustomLoadingIndicator />
	}
	function getStopFromStopId(id: string) {
		return routeDataToShow?.busStopList.find((stop) => stop.stopId == id)
	}
	return (
		<View className="flex-1">
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: headerTitle || `Route ${force_route_code} - Map View`,
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
						<CustomLoadingIndicator size={14} style={{ marginHorizontal: 0, marginVertical: 5, marginRight: 12 }} />
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
					horizontal={true}
					contentContainerStyle={{
						paddingHorizontal: 20,
						columnGap: 20,
						// height:"95%"
					}}
					style={{
						// width:60*4,
						flex: 1

					}}
				>
					{busListToShow
						.sort((bus_a, bus_b) => parseInt(bus_a.seq || "0") - parseInt(bus_b.seq || "0"))
						.map((bus: BusData) => {
							const atStop = getStopFromStopId(bus.stopId)
							const bus_id = bus.busId.split("|")[0]
							// const atStop = getStopFromStopId(bus.stopId)
							const event_datas = results.find(
								(e) => e.data?.vehicle_id === bus_id
							)?.data?.events.slice(0, 45) || []
							return (
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
											latitudeDelta: 0.02,
											longitudeDelta: 0.02,
										})
										setFollowingBus(bus)
										ref_bottom_sheet.current?.snapToIndex(1)
									}}
									route_data={routeDataToShow}
									bus={bus}
									key={`BusContainer-${bus.plateNumber}`}
								>
									{Object.entries(groupBy(
										event_datas, (e) => e?.created_at?.slice(0, 10) as string
										// !!!IDK WHAT WENT WRONG WITH THE TYPING BUT DO NOT REMOVE THE []
									)).map(([key, value]) => {
										// console.log(`${value?.length} items for key ${key}`)
										let is_active: typeof value[0] | undefined = undefined
										if (value.at(0)?.event_label === "vehicle_created") {
											is_active = value.at(0) as any
											value.shift()
										}
										const paired = groupBy(
											value, (e, i) =>(i-i % 2).toString()
										)
										// console.log(Object.keys(paired).length)
										return <View className="flex-col pl-2">
											<SecondaryText style={{ color: theme.primaryDark }}>
												{key}
											</SecondaryText>
											<SecondaryText numberOfLines={Object.keys(paired).length + (is_active ? 1 : 0)} className="ml-2 text-sm">
												{is_active && (`${is_active.route_code} ${is_active.direction?"<-":"->"} | `+new Date(is_active?.created_at)?.toLocaleTimeString().slice(0, 5)
													+ " -> NOW \n")
												}
												{
													Object.entries(paired).map(
														([k, [destroyed, created]]) =>
															`${created?.route_code} ${created?.direction?"<-":"->"} | ` +
															new Date(created?.created_at).toLocaleTimeString().slice(0, 5) + " -> " + new Date(destroyed?.created_at).toLocaleTimeString().slice(0, 5)
													).join("\n")

												}
											</SecondaryText>

										</View>
									})}
								</BusContainer>
							)
						})}
				</ScrollView>
			</BottomSheet>
		</View>
	)
}
