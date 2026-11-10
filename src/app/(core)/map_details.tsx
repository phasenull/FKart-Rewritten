import ApplicationConfig from "common/ApplicationConfig"
import BusData from "common/interfaces/KentKart/BusData"
import { Clipboard, Text, ToastAndroid, TouchableOpacity, Vibration, View } from "react-native"
import MapView from "react-native-maps"

import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import React, { LegacyRef, Ref, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Map from "../../components/map_details/Map"
import BusContainer from "../../components/reusables/BusContainer"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetCityList, useGetRouteDetails } from "common/hooks/kentkart/nonAuthHooks"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import Logger from "common/Logger"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { useQuery } from "react-query"
import ErrorPage from "../ErrorPage"
import FollowingBus from "../../components/map_details/FollowingBus"

type SheetMode = "buses" | "stops" | "times"

/**
 * Route page: the route line, stops and live buses on a map, with bus cards in a bottom sheet.
 * Opened as /route_details/[route_code] (route_code) or /map_details (force_route_code).
 */
export default function MapData() {
	const params = useLocalSearchParams<{
		force_direction?: string
		force_bus_id?: string
		force_route_code?: string
		route_code?: string
		headerTitle?: string
	}>()
	const route_code = (params.force_route_code || params.route_code) as string
	const insets = useSafeAreaInsets()
	const ref_map_view = useRef<MapView>(null)
	const ref_bottom_sheet = useRef<BottomSheet>(null)
	const user = useKentKartAuthStore((state) => state.user)
	const { data: cityData } = useGetCityList()
	const [direction, setDirection] = useState(parseInt(params.force_direction || "0") || 0)
	const [selectedBusId, setSelectedBusId] = useState<string | undefined>(params.force_bus_id)
	const [following, setFollowing] = useState(!!params.force_bus_id)
	const [mode, setMode] = useState<SheetMode>("buses")
	const [easterEggEnabled, setEasterEggEnabled] = useState(false)
	const { theme } = useContext(ThemeContext)
	const { data, isLoading, isRefetching, refetch, isError, error } = useGetRouteDetails({
		direction: direction,
		route_code: route_code,
		interval: 10 * 1_000,
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
		Logger.warning("map_details.tsx", "route details fetch error", (error as any)?.message)
	}
	const route = data?.data?.pathList?.at(0)
	const buses = useMemo(() => (route?.busList || []).slice().sort((a, b) => parseInt(a.seq || "0") - parseInt(b.seq || "0")), [route])
	const userCity = cityData?.data?.city?.find((city) => city.id === ApplicationConfig.region)

	// favorites (same storage as before: favs.routes keyed by the first 5 chars of path_code)
	const route_id = route?.path_code?.slice(0, 5)
	const { data: favorite, refetch: refetchFavorite } = useQuery(["get_favorites", route_id], {
		queryFn: async () => {
			const results: any[] = (await ApplicationConfig.database.get("favs.routes")) || []
			return results.find((e) => e.type === "route" && e.object_id === route_id) || null
		},
		enabled: !!route_id,
	})
	async function toggleFavorite() {
		const old: any[] = (await ApplicationConfig.database.get("favs.routes")) || []
		if (favorite) {
			await ApplicationConfig.database.set(
				"favs.routes",
				old.filter((e) => !(e.object_id === favorite.object_id && e.type === favorite.type))
			)
			ToastAndroid.show("Removed from favorites", ToastAndroid.SHORT)
		} else {
			const color = `rgb(${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)})`
			await ApplicationConfig.database.set("favs.routes", old.concat({ object_id: route_id, type: "route", extras: { color } }))
			ToastAndroid.show("Added to favorites", ToastAndroid.SHORT)
		}
		refetchFavorite()
	}

	function focusBus(bus: BusData) {
		ref_map_view.current?.animateToRegion({
			latitude: parseFloat(bus.lat) - 0.001,
			longitude: parseFloat(bus.lng),
			latitudeDelta: 0.02,
			longitudeDelta: 0.02,
		})
	}
	function selectBus(bus: BusData) {
		setSelectedBusId(bus.busId)
		focusBus(bus)
		ref_bottom_sheet.current?.snapToIndex(1)
	}
	// keep the followed bus centred on every refresh
	useEffect(() => {
		if (!following || !selectedBusId) return
		const bus = buses.find((e) => e.busId === selectedBusId)
		if (bus) focusBus(bus)
	}, [buses, following])

	const pressCounter = useRef({ last_press: 0, press_count: 0 })
	function pressForEasterEgg() {
		pressCounter.current.press_count++
		if (pressCounter.current.press_count === 1) pressCounter.current.last_press = Date.now()
		if (pressCounter.current.press_count >= 2) {
			if (Date.now() - pressCounter.current.last_press < 500) {
				Vibration.vibrate(500)
				ToastAndroid.show(`Easter Egg ${!easterEggEnabled ? "Enabled" : "Disabled"}`, ToastAndroid.SHORT)
				setEasterEggEnabled(!easterEggEnabled)
			}
			pressCounter.current.press_count = 0
			pressCounter.current.last_press = Date.now()
		}
	}

	if (isLoading || !userCity) {
		return <CustomLoadingIndicator />
	}
	if (!route) {
		const api_result = (data?.data as any)?.result
		return (
			<ErrorPage
				error={{
					title: api_result && api_result.code !== 0 ? "KentKart rejected the request" : "Nothing to see here!",
					description: api_result && api_result.code !== 0 ? `${api_result.message} (code ${api_result.code})` : (error as any)?.message || "No data for this direction",
				}}
				retry={() => refetch()}
				other={{ func: () => setDirection((old) => 1 - old), icon: "swap-horizontal-bold", description: "Other direction" }}
			/>
		)
	}

	const selectedBus = buses.find((e) => e.busId === selectedBusId)
	const now = new Date()
	const now_hhmm = `${`${now.getHours()}`.padStart(2, "0")}:${`${now.getMinutes()}`.padStart(2, "0")}`
	const times = (route.timeTableList || []).map((e) => e.departureTime?.slice(0, 5)).filter(Boolean).sort()
	const next_time = times.find((t) => t >= now_hhmm)
	const badge_color = favorite?.extras?.color || theme.secondary
	const card = { backgroundColor: theme.white, borderRadius: 16, elevation: 4 }
	const pill = { flex: 1, height: 46, borderRadius: 16, alignItems: "center" as const, justifyContent: "center" as const, flexDirection: "row" as const, gap: 6 }

	return (
		<View className="flex-1">
			<Stack.Screen options={{ headerShown: false }} />
			<Map
				easterEggEnabled={easterEggEnabled}
				busListToShow={buses}
				forwardRef={ref_map_view as LegacyRef<MapView>}
				routeDataToShow={route}
				userCity={userCity}
				selectedBusId={selectedBusId}
				onBusPress={selectBus}
			/>

			<View style={{ position: "absolute", top: insets.top + 8, left: 12, right: 12, gap: 8 }}>
				<View style={{ ...card, height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 8, gap: 8 }}>
					<TouchableOpacity accessibilityLabel="Back" hitSlop={8} onPress={() => router.back()} style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
						<MaterialCommunityIcons name="arrow-left" size={24} color={theme.secondary} />
					</TouchableOpacity>
					<View style={{ minWidth: 44, height: 32, borderRadius: 8, backgroundColor: badge_color, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 }}>
						<Text style={{ color: theme.white, fontWeight: "800", fontSize: 15 }}>{route.displayRouteCode}</Text>
					</View>
					<Text numberOfLines={1} style={{ flex: 1, color: theme.secondary, fontWeight: "800", fontSize: 14 }}>
						→ {route.headSign}
					</Text>
					{isRefetching ? <CustomLoadingIndicator size={14} style={{ margin: 0 }} /> : null}
					<TouchableOpacity accessibilityLabel="Favorite" hitSlop={6} onPress={toggleFavorite} style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
						<MaterialCommunityIcons name={favorite ? "star" : "star-outline"} size={24} color={favorite ? theme.primaryDark : theme.secondary} />
					</TouchableOpacity>
					<TouchableOpacity
						accessibilityLabel="Switch direction"
						onPress={() => {
							setDirection(1 - direction)
							setSelectedBusId(undefined)
							setFollowing(false)
						}}
						style={{ height: 36, paddingHorizontal: 10, borderRadius: 8, backgroundColor: theme.primary, alignItems: "center", justifyContent: "center" }}
					>
						<MaterialCommunityIcons name="swap-horizontal" size={22} color={theme.secondary} />
					</TouchableOpacity>
				</View>
				{following && selectedBus ? (
					<FollowingBus
						bus={selectedBus}
						onStopFollowing={() => setFollowing(false)}
					/>
				) : null}
			</View>

			<BottomSheet
				ref={ref_bottom_sheet as Ref<BottomSheetMethods>}
				backgroundStyle={{ backgroundColor: theme.dark }}
				snapPoints={["16%", "45%", "90%"]}
				index={1}
				enablePanDownToClose={false}
			>
				{mode === "buses" ? (
					<View style={{ flex: 1 }}>
						<View className="flex-row justify-between items-center" style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
							<Text style={{ color: theme.secondary, fontWeight: "800", fontSize: 15 }}>
								{buses.length ? `${buses.length} bus${buses.length === 1 ? "" : "es"}` : "No buses right now"}
							</Text>
							<Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "700", fontSize: 12 }}>
								{buses.length ? "swipe or tap a pin" : next_time ? `next departure ${next_time}` : ""}
							</Text>
						</View>
						<ScrollView horizontal={true} contentContainerStyle={{ paddingHorizontal: 16, columnGap: 12, paddingBottom: 4 }} style={{ flexGrow: 0 }}>
							{buses.map((bus) => (
								<View
									key={`BusContainer-${bus.busId}`}
									style={{ borderRadius: 19, borderWidth: 3, borderColor: bus.busId === selectedBusId ? theme.primaryDark : "transparent" }}
								>
									<BusContainer
										route_data={route}
										bus={bus}
										onPress={() => {
											pressForEasterEgg()
											selectBus(bus)
										}}
										onLongPress={() => {
											Clipboard.setString(`fkart://map_details?force_route_code=${route.displayRouteCode}&force_direction=${direction}&force_bus_id=${bus.busId}`)
											ToastAndroid.show("Link kopyalandı!", ToastAndroid.SHORT)
											Vibration.vibrate(100)
										}}
									/>
								</View>
							))}
						</ScrollView>
						<View className="flex-row" style={{ gap: 8, paddingHorizontal: 16, paddingTop: 12 }}>
							<TouchableOpacity onPress={() => setMode("stops")} style={{ ...pill, ...card }}>
								<MaterialCommunityIcons name="format-list-bulleted" size={18} color={theme.secondary} />
								<Text style={{ color: theme.secondary, fontWeight: "800" }}>Stops</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => setMode("times")} style={{ ...pill, ...card }}>
								<MaterialCommunityIcons name="clock-outline" size={18} color={theme.secondary} />
								<Text style={{ color: theme.secondary, fontWeight: "800" }}>Times</Text>
							</TouchableOpacity>
							<TouchableOpacity
								disabled={!selectedBus}
								onPress={() => setFollowing(!following)}
								style={{ ...pill, backgroundColor: following ? theme.primaryDark : theme.secondary, opacity: selectedBus ? 1 : 0.4 }}
							>
								<MaterialCommunityIcons name={following ? "crosshairs-gps" : "crosshairs"} size={18} color={following ? theme.secondary : theme.white} />
								<Text style={{ color: following ? theme.secondary : theme.white, fontWeight: "800" }}>{following ? "Following" : "Follow"}</Text>
							</TouchableOpacity>
						</View>
					</View>
				) : (
					<View style={{ flex: 1 }}>
						<TouchableOpacity onPress={() => setMode("buses")} className="flex-row items-center" style={{ gap: 4, paddingHorizontal: 16, paddingBottom: 8 }}>
							<MaterialCommunityIcons name="arrow-left" size={18} color={theme.secondary} />
							<Text style={{ color: theme.secondary, fontWeight: "800", fontSize: 15 }}>{mode === "stops" ? `Stops · ${route.busStopList.length}` : "Departures from the first stop"}</Text>
						</TouchableOpacity>
						<BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
							{mode === "stops" ? (
								<View style={{ ...card, paddingHorizontal: 14 }}>
									{route.busStopList.map((stop, i) => {
										const here = buses.filter((b) => b.stopId === stop.stopId)
										return (
											<TouchableOpacity
												key={`stop-${stop.stopId}-${i}`}
												onPress={() =>
													ref_map_view.current?.animateToRegion({ latitude: parseFloat(stop.lat), longitude: parseFloat(stop.lng), latitudeDelta: 0.01, longitudeDelta: 0.01 })
												}
												className="flex-row items-center"
												style={{ minHeight: 44, borderBottomWidth: i === route.busStopList.length - 1 ? 0 : 1, borderColor: "#f0f0f0", gap: 10 }}
											>
												<Text style={{ color: theme.secondary, opacity: 0.5, fontWeight: "800", fontSize: 12, width: 24 }}>{i + 1}</Text>
												<Text numberOfLines={1} style={{ flex: 1, color: theme.secondary, fontWeight: "700", fontSize: 14 }}>
													{stop.stopName}
												</Text>
												{here.map((b) => (
													<View key={`at-${b.busId}`} className="flex-row items-center" style={{ backgroundColor: theme.secondary, borderRadius: 12, paddingHorizontal: 8, height: 24, gap: 2 }}>
														<MaterialCommunityIcons name="bus" size={14} color={theme.white} />
														<Text style={{ color: theme.white, fontWeight: "800", fontSize: 11 }}>{b.plateNumber}</Text>
													</View>
												))}
											</TouchableOpacity>
										)
									})}
								</View>
							) : times.length ? (
								<View className="flex-row flex-wrap" style={{ gap: 8 }}>
									{times.map((t, i) => (
										<View
											key={`t-${i}`}
											style={{
												width: "22%",
												height: 40,
												borderRadius: 10,
												alignItems: "center",
												justifyContent: "center",
												backgroundColor: t === next_time ? theme.primary : theme.white,
												opacity: t < now_hhmm ? 0.4 : 1,
											}}
										>
											<Text style={{ color: theme.secondary, fontWeight: "800" }}>{t}</Text>
										</View>
									))}
								</View>
							) : (
								<Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "700" }}>No timetable for today</Text>
							)}
						</BottomSheetScrollView>
					</View>
				)}
			</BottomSheet>
		</View>
	)
}
