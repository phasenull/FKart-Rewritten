import { MaterialCommunityIcons } from "@expo/vector-icons"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import ErrorPage from "app/ErrorPage"
import ApplicationConfig from "common/ApplicationConfig"
import { ThemeContext } from "common/contexts/ThemeContext"
import { fetchRouteInfo, getDisplayRouteCodes, useGetCityList, useGetRealtime } from "common/hooks/kentkart/nonAuthHooks"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import SecondaryText from "components/reusables/SecondaryText"
import { router, Stack } from "expo-router"
import { transit_realtime } from "gtfs-realtime-bindings"
import React, { LegacyRef, Ref, useContext, useMemo, useRef, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useQuery } from "react-query"

type Entity = transit_realtime.IFeedEntity
interface VtsEvent {
	created_at: string
	route_code: number
	direction: 0 | 1
	event_label: string
}

function routeOf(e: Entity) {
	return e.vehicle?.trip?.routeId?.split("|")[0] as string
}
function directionOf(e: Entity): number | undefined {
	const trip: any = e.vehicle?.trip
	if (trip?.directionId === 0 || trip?.directionId === 1) return trip.directionId
	const part = trip?.routeId?.split("|")[1]
	return part === "0" || part === "1" ? parseInt(part) : undefined
}
function plateOf(e: Entity) {
	return e.vehicle?.vehicle?.licensePlate || e.vehicle?.vehicle?.id?.split("|")[0] || "??"
}
function idOf(e: Entity) {
	return (e.vehicle?.vehicle?.id?.split("|")[0] || e.id) as string
}

/** stop names and headsigns of the favorite routes, from route/info (both directions) */
function useRouteNames(route_codes: string[]) {
	const region = useKentKartAuthStore((state) => state.region) as string
	return useQuery(
		["group_route_names", region, route_codes.slice().sort().join(",")],
		async () => {
			const display = await getDisplayRouteCodes(region)
			const stops: Record<string, string> = {}
			const headsigns: Record<string, string> = {}
			await Promise.all(
				route_codes.flatMap((code) =>
					[0, 1].map(async (direction) => {
						try {
							const response = await fetchRouteInfo({ region, lang: "tr", direction: `${direction}`, displayRouteCode: display[code] || code, resultType: "001000" })
							const path = response?.data?.pathList?.at(0)
							if (!path) return
							headsigns[`${code}|${direction}`] = path.headSign
							for (const stop of path.busStopList || []) stops[stop.stopId] = stop.stopName
						} catch {}
					})
				)
			)
			return { stops, headsigns, display }
		},
		{ enabled: route_codes.length > 0, staleTime: 60 * 60 * 1000 }
	)
}

/** today's trips of one bus from the kk_vts event log, newest first */
function useBusTrips(vehicle_id?: string) {
	return useQuery(
		["bus_trips", vehicle_id],
		async () => {
			const API = await ApplicationConfig.database.get("kk_vts_api")
			if (!API) return { missing_api: true, trips: [] as { route: number; direction: number; start: Date; end?: Date }[] }
			const value = (vehicle_id as string).replaceAll(".", "").replaceAll("/", "")
			const response = await fetch(`${API}/api/events/search?key=bus&value=${value}`)
			const json = await response.json()
			const events: VtsEvent[] = (json?.data || []).slice().sort((a: VtsEvent, b: VtsEvent) => a.created_at.localeCompare(b.created_at))
			const today = new Date().toDateString()
			const trips: { route: number; direction: number; start: Date; end?: Date }[] = []
			for (const event of events) {
				const at = new Date(event.created_at)
				if (at.toDateString() !== today) continue
				if (event.event_label === "vehicle_created") trips.push({ route: event.route_code, direction: event.direction, start: at })
				else if (trips.length && !trips[trips.length - 1].end) trips[trips.length - 1].end = at
			}
			return { missing_api: false, trips: trips.reverse() }
		},
		{ enabled: !!vehicle_id, staleTime: 60 * 1000 }
	)
}

function hhmm(date?: Date) {
	return date ? `${`${date.getHours()}`.padStart(2, "0")}:${`${date.getMinutes()}`.padStart(2, "0")}` : "now"
}

export default function GrouppedMap() {
	const { theme } = useContext(ThemeContext)
	const insets = useSafeAreaInsets()
	const ref_map_view = useRef<MapView>()
	const ref_bottom_sheet = useRef<BottomSheet>()
	const [hidden, setHidden] = useState<Record<string, boolean>>({})
	const [selected, setSelected] = useState<string | undefined>()
	const { data: cityData } = useGetCityList()
	const { data: fav_data } = useQuery(["get_favs"], {
		queryFn: async () => ((await ApplicationConfig.database.get("favs.routes")) || []) as any[],
	})
	const route_codes: string[] = useMemo(() => (fav_data || []).map((e: any) => e.object_id).filter(Boolean), [fav_data])
	const colors: Record<string, string> = useMemo(() => Object.fromEntries((fav_data || []).map((e: any) => [e.object_id, e.extras?.color || theme.secondary])), [fav_data])
	const { data, isLoading, isError, error, refetch, isRefetching } = useGetRealtime(route_codes)
	const { data: names } = useRouteNames(route_codes)
	const userCity = cityData?.data?.city?.find((city) => city.id === ApplicationConfig.region)

	const all: Entity[] = useMemo(() => (data?.feed || []).filter((e) => route_codes.includes(routeOf(e))), [data, route_codes])
	const visible = useMemo(
		() =>
			all
				.filter((e) => !hidden[routeOf(e)])
				.sort((a, b) => route_codes.indexOf(routeOf(a)) - route_codes.indexOf(routeOf(b)) || (directionOf(a) ?? 0) - (directionOf(b) ?? 0) || plateOf(a).localeCompare(plateOf(b))),
		[all, hidden, route_codes]
	)
	const selectedEntity = visible.find((e) => idOf(e) === selected)
	const { data: trips, isLoading: tripsLoading } = useBusTrips(selectedEntity ? idOf(selectedEntity) : undefined)

	function label(code: string) {
		return names?.display?.[code] || code
	}
	function select(e: Entity) {
		const id = idOf(e)
		if (selected === id) return setSelected(undefined)
		setSelected(id)
		ref_map_view.current?.animateToRegion({
			latitude: (e.vehicle?.position?.latitude as number) - 0.002,
			longitude: e.vehicle?.position?.longitude as number,
			latitudeDelta: 0.02,
			longitudeDelta: 0.02,
		})
		ref_bottom_sheet.current?.snapToIndex(1)
	}

	if (fav_data && !fav_data.length) {
		return (
			<View className="flex-1 items-center justify-center" style={{ padding: 24 }}>
				<Stack.Screen options={{ headerShown: true, headerTitle: "Group view" }} />
				<SecondaryText style={{ textAlign: "center" }}>No favorite routes yet.{"\n"}Open a route and tap the star to add it here.</SecondaryText>
			</View>
		)
	}
	if (isError && !data?.feed) {
		return <ErrorPage retry={isRefetching ? () => null : refetch} error={{ description: (error as any)?.message, title: "Couldn't fetch live buses" }} />
	}
	if (!userCity || !fav_data) return <CustomLoadingIndicator />

	const card = { backgroundColor: theme.white, borderRadius: 16, elevation: 4 }
	return (
		<React.Fragment>
			<Stack.Screen options={{ headerShown: false }} />
			<MapView
				ref={ref_map_view as LegacyRef<MapView>}
				showsUserLocation={true}
				provider={PROVIDER_GOOGLE}
				style={{ flex: 1 }}
				initialRegion={{
					latitude: parseFloat(userCity.initialRegion.lat),
					longitude: parseFloat(userCity.initialRegion.lng),
					latitudeDelta: 0.08,
					longitudeDelta: 0.08,
				}}
			>
				{visible.map((e) => {
					const code = routeOf(e)
					const is_selected = idOf(e) === selected
					return (
						<Marker
							key={`${idOf(e)}-${is_selected}`}
							tracksViewChanges={false}
							zIndex={is_selected ? 20 : 10}
							anchor={{ x: 0.5, y: 0.5 }}
							coordinate={{ latitude: e.vehicle?.position?.latitude as number, longitude: e.vehicle?.position?.longitude as number }}
							onPress={() => select(e)}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									gap: 2,
									backgroundColor: colors[code],
									borderColor: is_selected ? theme.secondary : theme.white,
									borderWidth: is_selected ? 3 : 2,
									borderRadius: 14,
									paddingHorizontal: 6,
									height: is_selected ? 32 : 26,
								}}
							>
								<MaterialCommunityIcons name="bus" size={14} color={theme.white} />
								<Text style={{ color: theme.white, fontWeight: "800", fontSize: 12 }}>{label(code)}</Text>
							</View>
						</Marker>
					)
				})}
			</MapView>

			<View style={{ position: "absolute", top: insets.top + 8, left: 12, right: 12, gap: 8 }}>
				<View style={{ ...card, height: 50, flexDirection: "row", alignItems: "center", paddingHorizontal: 8, gap: 8 }}>
					<TouchableOpacity accessibilityLabel="Back" hitSlop={8} onPress={() => router.back()} style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
						<MaterialCommunityIcons name="arrow-left" size={24} color={theme.secondary} />
					</TouchableOpacity>
					<Text style={{ flex: 1, color: theme.secondary, fontWeight: "800", fontSize: 16 }}>Group view</Text>
					{isLoading || isRefetching ? <CustomLoadingIndicator size={14} style={{ margin: 0 }} /> : null}
					<Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "800", fontSize: 12, marginRight: 6 }}>
						{visible.length} buses{data?.source === "route_info" ? " · fallback" : ""}
					</Text>
				</View>
				<View className="flex-row flex-wrap" style={{ gap: 8 }}>
					{route_codes.map((code) => {
						const off = !!hidden[code]
						const count = all.filter((e) => routeOf(e) === code).length
						return (
							<TouchableOpacity
								key={`chip-${code}`}
								accessibilityLabel={`${off ? "Show" : "Hide"} route ${label(code)}`}
								onPress={() => setHidden({ ...hidden, [code]: !off })}
								style={{
									...card,
									height: 34,
									borderRadius: 17,
									paddingHorizontal: 12,
									flexDirection: "row",
									alignItems: "center",
									gap: 6,
									backgroundColor: off ? theme.white : colors[code],
								}}
							>
								<MaterialCommunityIcons name={off ? "eye-off" : "eye"} size={16} color={off ? "#8a94a6" : theme.white} />
								<Text style={{ color: off ? "#8a94a6" : theme.white, fontWeight: "800", fontSize: 13 }}>
									{label(code)} · {count}
								</Text>
							</TouchableOpacity>
						)
					})}
				</View>
			</View>

			<BottomSheet
				ref={ref_bottom_sheet as Ref<BottomSheetMethods>}
				backgroundStyle={{ backgroundColor: theme.dark }}
				snapPoints={["14%", "42%", "88%"]}
				index={1}
				enablePanDownToClose={false}
			>
				<BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
					{visible.length === 0 ? (
						<Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "700", textAlign: "center", marginTop: 12 }}>
							{all.length ? "All routes are hidden, tap a chip to show one" : "No buses on your favorite routes right now"}
						</Text>
					) : (
						<View style={{ ...card, overflow: "hidden" }}>
							{visible.map((e, i) => {
								const code = routeOf(e)
								const dir = directionOf(e)
								const headsign = dir !== undefined ? names?.headsigns?.[`${code}|${dir}`] : undefined
								const stop = e.vehicle?.stopId ? names?.stops?.[e.vehicle.stopId] : undefined
								const is_selected = idOf(e) === selected
								return (
									<View key={`row-${idOf(e)}`} style={{ borderTopWidth: i === 0 ? 0 : 1, borderColor: "#f0f0f0", backgroundColor: is_selected ? "#FFF8D1" : theme.white }}>
										<TouchableOpacity onPress={() => select(e)} className="flex-row items-center" style={{ gap: 10, paddingHorizontal: 14, paddingVertical: 10 }}>
											<View style={{ minWidth: 40, height: 26, borderRadius: 7, backgroundColor: colors[code], alignItems: "center", justifyContent: "center", paddingHorizontal: 4 }}>
												<Text style={{ color: theme.white, fontWeight: "800", fontSize: 13 }}>{label(code)}</Text>
											</View>
											<View style={{ flex: 1 }}>
												<Text numberOfLines={1} style={{ color: theme.secondary, fontWeight: "800", fontSize: 14 }}>
													{plateOf(e)}
													<Text style={{ opacity: 0.6 }}>{headsign ? `  → ${headsign}` : e.vehicle?.vehicle?.label ? `  ${e.vehicle.vehicle.label}` : ""}</Text>
												</Text>
												<Text numberOfLines={1} style={{ color: theme.secondary, opacity: 0.6, fontWeight: "700", fontSize: 12 }}>
													{stop ? `at ${stop}` : "on the way"}
												</Text>
											</View>
											<MaterialCommunityIcons name={is_selected ? "chevron-up" : "chevron-down"} size={20} color={theme.secondary} />
										</TouchableOpacity>
										{is_selected ? (
											<View style={{ paddingHorizontal: 14, paddingBottom: 12, paddingLeft: 64, gap: 4 }}>
												<Text style={{ color: theme.secondary, opacity: 0.5, fontWeight: "800", fontSize: 11, letterSpacing: 0.5 }}>TODAY ON THIS BUS</Text>
												{tripsLoading ? (
													<CustomLoadingIndicator size={14} style={{ margin: 0, alignSelf: "flex-start" }} />
												) : trips?.missing_api ? (
													<TouchableOpacity onPress={() => router.navigate({ pathname: "/AppData", params: { fill_key: "kk_vts_api" } })}>
														<Text style={{ color: theme.secondary, fontWeight: "700", fontSize: 13, textDecorationLine: "underline" }}>Set kk_vts_api to see trip history</Text>
													</TouchableOpacity>
												) : trips?.trips.length ? (
													trips.trips.slice(0, 8).map((t, j) => (
														<View key={`trip-${j}`} className="flex-row" style={{ gap: 10 }}>
															<Text style={{ color: theme.secondary, opacity: t.end ? 0.6 : 1, fontWeight: "700", fontSize: 13, width: 96 }}>
																{hhmm(t.start)}–{hhmm(t.end)}
															</Text>
															<Text style={{ color: t.end ? theme.secondary : colors[code], opacity: t.end ? 0.6 : 1, fontWeight: "800", fontSize: 13 }}>
																Route {t.route} {t.direction ? "←" : "→"}
															</Text>
														</View>
													))
												) : (
													<Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "700", fontSize: 13 }}>No trips logged today</Text>
												)}
											</View>
										) : null}
									</View>
								)
							})}
						</View>
					)}
				</BottomSheetScrollView>
			</BottomSheet>
		</React.Fragment>
	)
}
