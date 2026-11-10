import { MaterialCommunityIcons } from "@expo/vector-icons"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import ApplicationConfig from "common/ApplicationConfig"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetCityList } from "common/hooks/kentkart/nonAuthHooks"
import RouteData from "common/interfaces/KentKart/RouteData"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { colorsFor, describeStatus, NEXT_BUS_COLOR, optionKey, optionQuery, optionStatus, useWayOptions, useWays, WayOption } from "common/ways"
import { BusMarker } from "components/map_details/markers/BusMarker"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import { router, Stack, useLocalSearchParams } from "expo-router"
import React, { LegacyRef, Ref, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useQueries } from "react-query"
import ErrorPage from "./../ErrorPage"

/** every route/direction of a saved way on one map, each in its own color, with live buses */
export default function WayMap() {
	const { way_id } = useLocalSearchParams<{ way_id: string }>()
	const { theme } = useContext(ThemeContext)
	const insets = useSafeAreaInsets()
	const region = useKentKartAuthStore((state) => state.region) as string
	const ref_map = useRef<MapView>(null)
	const ref_sheet = useRef<BottomSheet>(null)
	const fitted = useRef(false)
	const [hidden, setHidden] = useState<Record<string, boolean>>({})
	const { data: ways, isLoading: waysLoading } = useWays()
	const { data: cityData } = useGetCityList()
	const way = ways?.find((e) => e.id === way_id)
	// every route that goes from A to B (boarding / alighting allowed), not only the ones the way was made with
	const { data: segmentOptions, isLoading: resolving } = useWayOptions(way)
	const colors = useMemo(() => colorsFor(segmentOptions || []), [segmentOptions])
	const keys = Object.keys(colors)
	const options: WayOption[] = keys.map((key) => (segmentOptions || []).flat().find((o) => optionKey(o) === key) as WayOption)
	const results = useQueries(options.map((option) => optionQuery(region, option)))
	const paths: Record<string, RouteData | undefined> = Object.fromEntries(keys.map((key, i) => [key, results[i]?.data]))
	const allLoaded = !resolving && results.length > 0 && results.every((r) => !r.isLoading)
	const userCity = cityData?.data?.city?.find((city) => city.id === ApplicationConfig.region)

	// the stops where you get on, transfer and get off, in order
	const waypoints = useMemo(() => {
		if (!way) return []
		const list = way.segments.flatMap((s, i) => (i === 0 ? [s.from, s.to] : [s.to]))
		return list.map((stop) => {
			for (const path of Object.values(paths)) {
				const found = path?.busStopList?.find((e) => e.stopId === stop.id)
				if (found) return { ...stop, lat: parseFloat(found.lat), lng: parseFloat(found.lng) }
			}
			return { ...stop, lat: undefined, lng: undefined }
		})
	}, [way, allLoaded])

	function fit() {
		const coords = Object.entries(paths)
			.filter(([key]) => !hidden[key])
			.flatMap(([, path]) => (path?.pointList || []).map((p) => ({ latitude: parseFloat(p.lat), longitude: parseFloat(p.lng) })))
		if (!coords.length) return
		ref_map.current?.fitToCoordinates(coords, { edgePadding: { top: insets.top + 90, right: 40, bottom: 360, left: 40 }, animated: true })
	}
	useEffect(() => {
		if (allLoaded && !fitted.current) {
			fitted.current = true
			setTimeout(fit, 300)
		}
	}, [allLoaded])

	if (waysLoading || !userCity) return <CustomLoadingIndicator />
	if (!way) return <ErrorPage error={{ title: "Way not found", description: "It may have been deleted" }} retry={() => router.back()} />

	const card = { backgroundColor: theme.white, borderRadius: 16, elevation: 4 }
	const refetching = results.some((r) => r.isFetching)
	return (
		<React.Fragment>
			<Stack.Screen options={{ headerShown: false }} />
			<MapView
				ref={ref_map as LegacyRef<MapView>}
				provider={PROVIDER_GOOGLE}
				showsUserLocation={true}
				style={{ flex: 1 }}
				initialRegion={{ latitude: parseFloat(userCity.initialRegion.lat), longitude: parseFloat(userCity.initialRegion.lng), latitudeDelta: 0.08, longitudeDelta: 0.08 }}
			>
				{keys
					.filter((key) => !hidden[key] && paths[key])
					.map((key) => (
						<Polyline
							key={`line-${key}`}
							coordinates={(paths[key]?.pointList || []).map((p) => ({ latitude: parseFloat(p.lat), longitude: parseFloat(p.lng) }))}
							strokeColor={colors[key]}
							strokeWidth={5}
						/>
					))}
				{waypoints.map((stop, i) =>
					stop.lat !== undefined && stop.lng !== undefined ? (
						<Marker key={`wp-${i}-${stop.id}`} tracksViewChanges={false} coordinate={{ latitude: stop.lat, longitude: stop.lng }} title={stop.name} anchor={{ x: 0.5, y: 0.5 }} zIndex={30}>
							<View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: theme.secondary, borderWidth: 3, borderColor: theme.white, alignItems: "center", justifyContent: "center" }}>
								<Text style={{ color: theme.white, fontWeight: "800", fontSize: 11 }}>{i === 0 ? "A" : i === waypoints.length - 1 ? "B" : `${i}`}</Text>
							</View>
						</Marker>
					) : null
				)}
				{keys
					.filter((key) => !hidden[key] && paths[key])
					.flatMap((key) =>
						(paths[key]?.busList || []).map((bus) => (
							<BusMarker
								key={`bus-${key}-${bus.busId}`}
								bus={bus}
								route_data={paths[key]}
								force_color={colors[key]}
								label={paths[key]?.displayRouteCode}
								coordinate={{ latitude: parseFloat(bus.lat), longitude: parseFloat(bus.lng) }}
							/>
						))
					)}
			</MapView>

			<View style={{ position: "absolute", top: insets.top + 8, left: 12, right: 12 }}>
				<View style={{ ...card, height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 8, gap: 8 }}>
					<TouchableOpacity accessibilityLabel="Back" hitSlop={8} onPress={() => router.back()} style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
						<MaterialCommunityIcons name="arrow-left" size={24} color={theme.secondary} />
					</TouchableOpacity>
					<MaterialCommunityIcons name="map-marker-path" size={22} color={theme.primaryDark} />
					<Text numberOfLines={1} style={{ flex: 1, color: theme.secondary, fontWeight: "800", fontSize: 16 }}>
						{way.name}
					</Text>
					{refetching ? <CustomLoadingIndicator size={14} style={{ margin: 0 }} /> : null}
					<TouchableOpacity accessibilityLabel="Edit way" hitSlop={8} onPress={() => router.navigate({ pathname: "/way_editor", params: { way_id: way.id } })} style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
						<MaterialCommunityIcons name="pencil" size={20} color={theme.secondary} />
					</TouchableOpacity>
				</View>
			</View>

			<BottomSheet ref={ref_sheet as Ref<BottomSheetMethods>} backgroundStyle={{ backgroundColor: theme.dark }} snapPoints={["18%", "42%", "88%"]} index={1} enablePanDownToClose={false}>
				<View className="flex-row items-center justify-between" style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
					<Text style={{ color: theme.secondary, fontWeight: "800", fontSize: 15 }}>
						{way.segments.length === 1 ? "Direct" : `${way.segments.length} parts · ${way.segments.length - 1} transfer${way.segments.length > 2 ? "s" : ""}`}
					</Text>
					<TouchableOpacity onPress={fit} style={{ height: 40, paddingHorizontal: 14, borderRadius: 12, backgroundColor: theme.primary, flexDirection: "row", alignItems: "center", gap: 6 }}>
						<MaterialCommunityIcons name="fit-to-screen-outline" size={20} color={theme.secondary} />
						<Text style={{ color: theme.secondary, fontWeight: "800", fontSize: 13 }}>Fit</Text>
					</TouchableOpacity>
				</View>
				<BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}>
					{way.segments.map((segment, i) => (
						<View key={`seg-${i}`} style={{ ...card, overflow: "hidden" }}>
							<View className="flex-row items-center" style={{ gap: 8, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 }}>
								<View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: theme.secondary, alignItems: "center", justifyContent: "center" }}>
									<Text style={{ color: theme.white, fontWeight: "800", fontSize: 11 }}>{i + 1}</Text>
								</View>
								<Text numberOfLines={2} style={{ flex: 1, color: theme.secondary, fontWeight: "800", fontSize: 14 }}>
									{segment.from.name} → {segment.to.name}
								</Text>
							</View>
							{resolving ? (
								<View style={{ padding: 14 }}>
									<CustomLoadingIndicator size={16} style={{ margin: 0, alignSelf: "flex-start" }} />
								</View>
							) : (segmentOptions?.[i] || []).length === 0 ? (
								<Text style={{ color: theme.error, fontWeight: "700", fontSize: 13, paddingHorizontal: 14, paddingBottom: 12 }}>No direct bus between these stops</Text>
							) : null}
							{(segmentOptions?.[i] || []).map((option) => {
								const key = optionKey(option)
								const result = results[keys.indexOf(key)]
								const status = describeStatus(optionStatus(option, segment.from.id, paths[key]), segment.from.name)
								const off = !!hidden[key]
								return (
									<View key={`opt-${i}-${key}`} className="flex-row items-center" style={{ borderTopWidth: 1, borderColor: "#f0f0f0", paddingLeft: 14, opacity: off ? 0.45 : 1 }}>
										<TouchableOpacity
											onPress={() => router.navigate({ pathname: "/map_details", params: { force_route_code: option.route_code, force_direction: `${option.direction}` } })}
											className="flex-row items-center"
											style={{ flex: 1, gap: 10, paddingVertical: 10 }}
										>
											<View style={{ minWidth: 40, height: 26, borderRadius: 7, backgroundColor: colors[key], alignItems: "center", justifyContent: "center", paddingHorizontal: 4 }}>
												<Text style={{ color: theme.white, fontWeight: "800", fontSize: 13 }}>{option.route_code}</Text>
											</View>
											<View style={{ flex: 1 }}>
												<Text numberOfLines={1} style={{ color: theme.secondary, fontWeight: "800", fontSize: 13 }}>
													→ {option.headsign}
												</Text>
												<Text numberOfLines={2} style={{ color: status.tone === "ok" ? theme.secondary : status.tone === "warn" ? NEXT_BUS_COLOR : theme.error, opacity: status.tone === "ok" ? 0.7 : 1, fontWeight: "800", fontSize: 12 }}>
													{result?.isLoading ? "Loading…" : result?.isError && !result.data ? "Couldn't load this route" : status.text}
												</Text>
											</View>
										</TouchableOpacity>
										<TouchableOpacity
											accessibilityLabel={`${off ? "Show" : "Hide"} route ${option.route_code} on the map`}
											onPress={() => setHidden({ ...hidden, [key]: !off })}
											style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
										>
											<MaterialCommunityIcons name={off ? "eye-off" : "eye"} size={20} color={theme.secondary} />
										</TouchableOpacity>
									</View>
								)
							})}
						</View>
					))}
				</BottomSheetScrollView>
			</BottomSheet>
		</React.Fragment>
	)
}
