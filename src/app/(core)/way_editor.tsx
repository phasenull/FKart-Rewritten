import { MaterialCommunityIcons } from "@expo/vector-icons"
import ApplicationConfig from "common/ApplicationConfig"
import { ThemeContext } from "common/contexts/ThemeContext"
import useGetRouteList from "common/hooks/fkart/static/useGetRouteList"
import { useGetCityList } from "common/hooks/kentkart/nonAuthHooks"
import BasicRouteInformation from "common/interfaces/KentKart/BasicRouteInformation"
import BasicStopInformation from "common/interfaces/KentKart/BasicStopInformation"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { deleteWay, getRouteShape, getWays, reachableStops, saveWay, Way, WAY_COLORS, WayStop } from "common/ways"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { LegacyRef, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native"
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import { useQuery, useQueryClient } from "react-query"

type Step = "overview" | "browse" | "pick_from" | "pick_to"

function toWayStop(stop: BasicStopInformation): WayStop {
	return { id: stop.stopId, name: stop.stopName, lat: parseFloat(stop.lat), lng: parseFloat(stop.lng), routes: stop.routes }
}

/** map of tappable stops with optional route lines; fits itself to the stops */
function StopPickerMap(props: {
	lines: { key: string; coords: { latitude: number; longitude: number }[]; color: string }[]
	stops: BasicStopInformation[]
	selectedId?: string
	fixed?: WayStop
	onPick: (stop: BasicStopInformation) => void
	initial: { latitude: number; longitude: number }
}) {
	const { theme } = useContext(ThemeContext)
	const ref = useRef<MapView>(null)
	useEffect(() => {
		const coords = props.stops.map((s) => ({ latitude: parseFloat(s.lat), longitude: parseFloat(s.lng) }))
		if (props.fixed?.lat && props.fixed?.lng) coords.push({ latitude: props.fixed.lat, longitude: props.fixed.lng })
		if (coords.length) setTimeout(() => ref.current?.fitToCoordinates(coords, { edgePadding: { top: 60, right: 40, bottom: 220, left: 40 }, animated: true }), 300)
	}, [props.stops])
	return (
		<MapView
			ref={ref as LegacyRef<MapView>}
			provider={PROVIDER_GOOGLE}
			showsUserLocation={true}
			style={{ flex: 1 }}
			initialRegion={{ ...props.initial, latitudeDelta: 0.08, longitudeDelta: 0.08 }}
		>
			{props.lines.map((line) => (
				<Polyline key={line.key} coordinates={line.coords} strokeColor={line.color} strokeWidth={3} />
			))}
			{props.fixed?.lat && props.fixed?.lng ? (
				<Marker key={`fixed-${props.fixed.id}`} tracksViewChanges={false} coordinate={{ latitude: props.fixed.lat, longitude: props.fixed.lng }} title={props.fixed.name} zIndex={40} anchor={{ x: 0.5, y: 0.5 }}>
					<View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: theme.secondary, borderWidth: 3, borderColor: theme.white, alignItems: "center", justifyContent: "center" }}>
						<Text style={{ color: theme.white, fontWeight: "800", fontSize: 11 }}>A</Text>
					</View>
				</Marker>
			) : null}
			{props.stops.map((stop) => {
				const selected = stop.stopId === props.selectedId
				return (
					<Marker
						key={`stop-${stop.stopId}-${selected}`}
						tracksViewChanges={false}
						coordinate={{ latitude: parseFloat(stop.lat), longitude: parseFloat(stop.lng) }}
						anchor={{ x: 0.5, y: 0.5 }}
						zIndex={selected ? 30 : 10}
						onPress={() => props.onPick(stop)}
					>
						<View
							style={{
								width: selected ? 22 : 14,
								height: selected ? 22 : 14,
								borderRadius: 11,
								backgroundColor: selected ? theme.primary : theme.white,
								borderWidth: 3,
								borderColor: theme.secondary,
							}}
						/>
					</Marker>
				)
			})}
		</MapView>
	)
}

export default function WayEditor() {
	const { way_id } = useLocalSearchParams<{ way_id?: string }>()
	const { theme } = useContext(ThemeContext)
	const queryClient = useQueryClient()
	const region = useKentKartAuthStore((state) => state.region) as string
	const { data: cityData } = useGetCityList()
	const userCity = cityData?.data?.city?.find((city) => city.id === ApplicationConfig.region)
	const [loaded, setLoaded] = useState(!way_id)
	const [way, setWay] = useState<Way>({ id: `${Date.now()}`, name: "", segments: [] })
	const [step, setStep] = useState<Step>("overview")
	const [search, setSearch] = useState("")
	const [browseRoute, setBrowseRoute] = useState<BasicRouteInformation | undefined>()
	const [from, setFrom] = useState<WayStop | undefined>()
	const [picked, setPicked] = useState<BasicStopInformation | undefined>()
	const { data: routeListData, isLoading: routeListLoading } = useGetRouteList()

	useEffect(() => {
		if (!way_id) return
		getWays().then((ways) => {
			const found = ways.find((e) => e.id === way_id)
			if (found) setWay(found)
			setLoaded(true)
		})
	}, [way_id])

	// stops of a route picked just to find the first stop (both directions, boardable only)
	const { data: browseShapes, isLoading: browseLoading } = useQuery(
		["way_browse", region, browseRoute?.displayRouteCode],
		() => Promise.all([0, 1].map((d) => getRouteShape(region, browseRoute?.displayRouteCode as string, d))),
		{ enabled: step === "pick_from" && !!browseRoute, staleTime: 60 * 60 * 1000 }
	)
	const browseStops = useMemo(() => {
		const seen = new Map<string, BasicStopInformation>()
		for (const path of browseShapes || []) for (const stop of path?.busStopList || []) if (`${stop.pickupType ?? "0"}` !== "1" && !seen.has(stop.stopId)) seen.set(stop.stopId, stop)
		return [...seen.values()]
	}, [browseShapes])

	// every stop you can get off at after boarding at `from`, on any route
	const { data: reachable, isLoading: reachableLoading } = useQuery(["way_reachable", region, from?.id], () => reachableStops(region, from as WayStop), {
		enabled: step === "pick_to" && !!from,
		staleTime: 60 * 60 * 1000,
	})
	const pickedRoutes = reachable?.stops.find((e) => e.stop.stopId === picked?.stopId)?.routes || []

	const filteredRoutes = useMemo(() => {
		const list = routeListData?.data?.routeList || []
		const text = search.trim().toLowerCase()
		if (!text) return list.slice(0, 60)
		return list.filter((e) => e.displayRouteCode.toLowerCase().startsWith(text) || e.name.toLowerCase().includes(text)).slice(0, 60)
	}, [routeListData, search])

	function startSegment() {
		setPicked(undefined)
		const last = way.segments.at(-1)
		if (last) {
			setFrom(last.to)
			setStep("pick_to")
		} else {
			setFrom(undefined)
			setStep("browse")
		}
	}
	async function save() {
		if (!way.name.trim()) return Alert.alert("Give this way a name", "For example: Home, Work, Gym")
		if (way.segments.length === 0) return Alert.alert("Add at least one part", "Pick where you get on and where you get off")
		await saveWay({ ...way, name: way.name.trim() })
		await queryClient.invalidateQueries(["ways"])
		router.back()
	}
	function remove() {
		Alert.alert("Delete this way?", way.name, [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					await deleteWay(way.id)
					await queryClient.invalidateQueries(["ways"])
					router.back()
				},
			},
		])
	}

	const text = { color: theme.secondary, fontWeight: "800" as const }
	const row = { backgroundColor: theme.white, borderRadius: 12, paddingHorizontal: 14, minHeight: 52, flexDirection: "row" as const, alignItems: "center" as const, gap: 12 }
	const button = { height: 48, borderRadius: 14, alignItems: "center" as const, justifyContent: "center" as const, flexDirection: "row" as const, gap: 6 }
	const title = { overview: way_id ? "Edit way" : "New way", browse: "Find your stop", pick_from: "Tap where you get on", pick_to: "Tap where you get off" }[step]
	const initial = userCity ? { latitude: parseFloat(userCity.initialRegion.lat), longitude: parseFloat(userCity.initialRegion.lng) } : { latitude: 0, longitude: 0 }

	if (!loaded || !userCity) return <CustomLoadingIndicator />
	return (
		<View style={{ flex: 1, backgroundColor: theme.dark }}>
			<Stack.Screen options={{ headerShown: true, headerTitle: title, headerTitleStyle: { color: theme.secondary, fontWeight: "900" } }} />

			{step === "overview" ? (
				<FlatList
					contentContainerStyle={{ padding: 16, gap: 10 }}
					data={way.segments}
					keyExtractor={(_, i) => `seg-${i}`}
					ListHeaderComponent={
						<View style={{ gap: 10, marginBottom: 4 }}>
							<Text style={{ ...text, opacity: 0.6, fontSize: 12 }}>NAME</Text>
							<TextInput value={way.name} onChangeText={(name) => setWay({ ...way, name })} placeholder="Home, Work, Gym…" placeholderTextColor="#8a94a6" style={{ ...row, ...text, fontSize: 16 }} />
							<Text style={{ ...text, opacity: 0.6, fontSize: 12, marginTop: 8 }}>PARTS, IN ORDER</Text>
							<Text style={{ ...text, opacity: 0.6, fontSize: 12, fontWeight: "600" }}>Every bus that goes between the two stops is shown, not only one route.</Text>
						</View>
					}
					renderItem={({ item, index }) => (
						<View style={row}>
							<View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: theme.secondary, alignItems: "center", justifyContent: "center" }}>
								<Text style={{ color: theme.white, fontWeight: "800", fontSize: 12 }}>{index + 1}</Text>
							</View>
							<Text style={{ ...text, flex: 1, paddingVertical: 10 }} numberOfLines={2}>
								{item.from.name} → {item.to.name}
							</Text>
							<TouchableOpacity hitSlop={10} accessibilityLabel="Remove this part" onPress={() => setWay({ ...way, segments: way.segments.filter((_, i) => i !== index) })}>
								<MaterialCommunityIcons name="close" size={20} color={theme.error} />
							</TouchableOpacity>
						</View>
					)}
					ListFooterComponent={
						<View style={{ gap: 10 }}>
							<TouchableOpacity onPress={startSegment} style={{ ...row, justifyContent: "center", backgroundColor: "transparent", borderWidth: 2, borderStyle: "dashed", borderColor: "#c4c9d2" }}>
								<MaterialCommunityIcons name="plus" size={20} color={theme.secondary} />
								<Text style={text}>{way.segments.length ? `Add a transfer from ${way.segments.at(-1)?.to.name}` : "Pick where you get on"}</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={save} style={{ ...row, justifyContent: "center", backgroundColor: theme.primary, marginTop: 12 }}>
								<Text style={{ ...text, fontSize: 16 }}>Save way</Text>
							</TouchableOpacity>
							{way_id ? (
								<TouchableOpacity onPress={remove} style={{ ...row, justifyContent: "center", backgroundColor: "transparent" }}>
									<Text style={{ ...text, color: theme.error }}>Delete way</Text>
								</TouchableOpacity>
							) : null}
						</View>
					}
				/>
			) : null}

			{step === "browse" ? (
				<View style={{ flex: 1 }}>
					<Text style={{ ...text, opacity: 0.7, fontSize: 13, fontWeight: "700", marginHorizontal: 16, marginTop: 12 }}>
						Pick any route that stops near you to see its stops on the map.
					</Text>
					<TextInput
						autoFocus
						value={search}
						onChangeText={setSearch}
						placeholder="Route number or name"
						placeholderTextColor="#8a94a6"
						style={{ ...row, ...text, fontSize: 16, margin: 16, marginBottom: 6, borderWidth: 2, borderColor: theme.primary }}
					/>
					{routeListLoading ? (
						<CustomLoadingIndicator />
					) : (
						<FlatList
							keyboardShouldPersistTaps="handled"
							contentContainerStyle={{ padding: 16, gap: 8 }}
							data={filteredRoutes}
							keyExtractor={(e) => e.routeCode}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={row}
									onPress={() => {
										setBrowseRoute(item)
										setPicked(undefined)
										setStep("pick_from")
									}}
								>
									<View style={{ minWidth: 44, height: 28, borderRadius: 7, backgroundColor: theme.secondary, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 }}>
										<Text style={{ color: theme.white, fontWeight: "800" }}>{item.displayRouteCode}</Text>
									</View>
									<Text style={{ ...text, flex: 1 }} numberOfLines={2}>
										{item.name}
									</Text>
								</TouchableOpacity>
							)}
						/>
					)}
				</View>
			) : null}

			{step === "pick_from" || step === "pick_to" ? (
				<View style={{ flex: 1 }}>
					{(step === "pick_from" ? browseLoading : reachableLoading) ? (
						<View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8 }}>
							<CustomLoadingIndicator />
							<Text style={{ ...text, opacity: 0.6 }}>{step === "pick_to" ? `Finding every bus from ${from?.name}…` : "Loading stops…"}</Text>
						</View>
					) : (
						<StopPickerMap
							initial={initial}
							fixed={step === "pick_to" ? from : undefined}
							lines={
								step === "pick_from"
									? (browseShapes || []).map((path, i) => ({
											key: `b-${i}`,
											color: WAY_COLORS[i],
											coords: (path?.pointList || []).map((p) => ({ latitude: parseFloat(p.lat), longitude: parseFloat(p.lng) })),
									  }))
									: (reachable?.lines || []).map((line, i) => ({
											key: `r-${line.route_code}-${line.direction}`,
											color: WAY_COLORS[i % WAY_COLORS.length],
											coords: (line.path.pointList || []).map((p) => ({ latitude: parseFloat(p.lat), longitude: parseFloat(p.lng) })),
									  }))
							}
							stops={step === "pick_from" ? browseStops : (reachable?.stops || []).map((e) => e.stop)}
							selectedId={picked?.stopId}
							onPick={setPicked}
						/>
					)}
					<View style={{ position: "absolute", left: 12, right: 12, bottom: 16, backgroundColor: theme.white, borderRadius: 18, padding: 14, gap: 10, elevation: 8 }}>
						{step === "pick_to" ? (
							<View className="flex-row items-center" style={{ gap: 8 }}>
								<Text numberOfLines={1} style={{ ...text, flex: 1, fontSize: 13 }}>
									From {from?.name}
								</Text>
								<TouchableOpacity
									onPress={() => {
										setPicked(undefined)
										setStep("browse")
									}}
									hitSlop={8}
								>
									<Text style={{ ...text, fontSize: 13, textDecorationLine: "underline" }}>Change (walk to another stop)</Text>
								</TouchableOpacity>
							</View>
						) : null}
						<Text numberOfLines={2} style={{ ...text, fontSize: 16 }}>
							{picked ? picked.stopName : step === "pick_from" ? "Tap the stop where you get on" : "Tap the stop where you get off"}
						</Text>
						{step === "pick_to" ? (
							<Text style={{ ...text, opacity: 0.7, fontSize: 12, fontWeight: "700" }}>
								{picked
									? `Buses: ${pickedRoutes.join(", ")}`
									: reachable
									? `${reachable.stops.length} stops reachable without a transfer`
									: ""}
							</Text>
						) : null}
						<View className="flex-row" style={{ gap: 8 }}>
							<TouchableOpacity
								onPress={() => {
									setPicked(undefined)
									setStep(step === "pick_from" ? "browse" : "overview")
								}}
								style={{ ...button, flex: 1, backgroundColor: theme.dark }}
							>
								<Text style={text}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								disabled={!picked}
								onPress={() => {
									if (!picked) return
									if (step === "pick_from") {
										setFrom(toWayStop(picked))
										setPicked(undefined)
										setStep("pick_to")
									} else {
										setWay({ ...way, segments: [...way.segments, { from: from as WayStop, to: toWayStop(picked) }] })
										setPicked(undefined)
										setStep("overview")
									}
								}}
								style={{ ...button, flex: 2, backgroundColor: theme.primary, opacity: picked ? 1 : 0.4 }}
							>
								<Text style={text}>{step === "pick_from" ? "Get on here" : "Get off here"}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			) : null}
		</View>
	)
}
