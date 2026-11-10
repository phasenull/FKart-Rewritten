import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ThemeContext } from "common/contexts/ThemeContext"
import useGetRouteList from "common/hooks/fkart/static/useGetRouteList"
import { fetchRouteInfo } from "common/hooks/kentkart/nonAuthHooks"
import BasicRouteInformation from "common/interfaces/KentKart/BasicRouteInformation"
import BasicStopInformation from "common/interfaces/KentKart/BasicStopInformation"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { deleteWay, getWays, Way, WayLeg } from "common/ways"
import { saveWay } from "common/ways"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { useContext, useEffect, useMemo, useState } from "react"
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useQuery, useQueryClient } from "react-query"

type Step = "overview" | "route" | "direction" | "board" | "alight"

export default function WayEditor() {
	const { way_id } = useLocalSearchParams<{ way_id?: string }>()
	const { theme } = useContext(ThemeContext)
	const queryClient = useQueryClient()
	const region = useKentKartAuthStore((state) => state.region) as string
	const [loaded, setLoaded] = useState(!way_id)
	const [way, setWay] = useState<Way>({ id: `${Date.now()}`, name: "", legs: [] })
	const [step, setStep] = useState<Step>("overview")
	const [search, setSearch] = useState("")
	const [draft, setDraft] = useState<{ route?: BasicRouteInformation; direction?: 0 | 1; board?: BasicStopInformation }>({})
	const { data: routeListData, isLoading: routeListLoading } = useGetRouteList()

	useEffect(() => {
		if (!way_id) return
		getWays().then((ways) => {
			const found = ways.find((e) => e.id === way_id)
			if (found) setWay(found)
			setLoaded(true)
		})
	}, [way_id])

	// both directions of the picked route (headsign + stops)
	const { data: directions, isLoading: directionsLoading } = useQuery(
		["way_editor_route", region, draft.route?.displayRouteCode],
		async () => {
			const code = draft.route?.displayRouteCode as string
			const results = await Promise.all(
				[0, 1].map((direction) =>
					fetchRouteInfo({ region, lang: "tr", direction: `${direction}`, displayRouteCode: code, resultType: "001000" })
						.then((e) => e?.data?.pathList?.at(0))
						.catch(() => undefined)
				)
			)
			return results
		},
		{ enabled: !!draft.route, staleTime: 60 * 60 * 1000 }
	)

	const filteredRoutes = useMemo(() => {
		const list = routeListData?.data?.routeList || []
		const text = search.trim().toLowerCase()
		if (!text) return list.slice(0, 60)
		return list.filter((e) => e.displayRouteCode.toLowerCase().startsWith(text) || e.name.toLowerCase().includes(text)).slice(0, 60)
	}, [routeListData, search])

	async function save() {
		if (!way.name.trim()) return Alert.alert("Give this way a name", "For example: Home, Work, Gym")
		if (way.legs.length === 0) return Alert.alert("Add at least one bus", "Tap \"Add a bus\" to pick a route and stops")
		await saveWay({ ...way, name: way.name.trim() })
		await queryClient.invalidateQueries(["ways"])
		router.back()
	}
	async function remove() {
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
	function finishLeg(alight: BasicStopInformation) {
		const path = directions?.[draft.direction as number]
		const leg: WayLeg = {
			route_code: draft.route?.displayRouteCode as string,
			direction: draft.direction as 0 | 1,
			headsign: path?.headSign || "",
			color: draft.route?.routeColor ? `#${draft.route.routeColor.replace("#", "")}` : undefined,
			board_stop_id: draft.board?.stopId as string,
			board_stop_name: draft.board?.stopName as string,
			alight_stop_id: alight.stopId,
			alight_stop_name: alight.stopName,
		}
		setWay({ ...way, legs: [...way.legs, leg] })
		setDraft({})
		setSearch("")
		setStep("overview")
	}

	const title = { overview: way_id ? "Edit way" : "New way", route: "Pick a route", direction: "Which direction?", board: "Where do you get on?", alight: "Where do you get off?" }[step]
	const text = { color: theme.secondary, fontWeight: "800" as const }
	const row = { backgroundColor: theme.white, borderRadius: 12, paddingHorizontal: 14, minHeight: 52, flexDirection: "row" as const, alignItems: "center" as const, gap: 12 }

	if (!loaded) return <CustomLoadingIndicator />
	return (
		<View style={{ flex: 1, backgroundColor: theme.dark }}>
			<Stack.Screen options={{ headerShown: true, headerTitle: title, headerTitleStyle: { color: theme.secondary, fontWeight: "900" } }} />
			{step !== "overview" ? (
				<TouchableOpacity
					onPress={() => {
						const back: Record<Step, Step> = { overview: "overview", route: "overview", direction: "route", board: "direction", alight: "board" }
						setStep(back[step])
					}}
					style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 16, paddingTop: 12 }}
				>
					<MaterialCommunityIcons name="arrow-left" size={18} color={theme.secondary} />
					<Text style={text}>Back</Text>
				</TouchableOpacity>
			) : null}

			{step === "overview" ? (
				<FlatList
					contentContainerStyle={{ padding: 16, gap: 10 }}
					data={way.legs}
					keyExtractor={(_, i) => `leg-${i}`}
					ListHeaderComponent={
						<View style={{ gap: 10, marginBottom: 4 }}>
							<Text style={{ ...text, opacity: 0.6, fontSize: 12 }}>NAME</Text>
							<TextInput
								value={way.name}
								onChangeText={(name) => setWay({ ...way, name })}
								placeholder="Home, Work, Gym…"
								placeholderTextColor="#8a94a6"
								style={{ ...row, ...text, fontSize: 16 }}
							/>
							<Text style={{ ...text, opacity: 0.6, fontSize: 12, marginTop: 8 }}>BUSES, IN ORDER</Text>
						</View>
					}
					renderItem={({ item, index }) => (
						<View style={row}>
							<View style={{ minWidth: 44, height: 28, borderRadius: 7, backgroundColor: item.color || theme.secondary, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 }}>
								<Text style={{ color: theme.white, fontWeight: "800" }}>{item.route_code}</Text>
							</View>
							<View style={{ flex: 1, paddingVertical: 8 }}>
								<Text style={text} numberOfLines={1}>
									{item.board_stop_name} → {item.alight_stop_name}
								</Text>
								<Text style={{ ...text, opacity: 0.6, fontSize: 12 }} numberOfLines={1}>
									towards {item.headsign}
								</Text>
							</View>
							<TouchableOpacity hitSlop={10} accessibilityLabel="Remove this bus" onPress={() => setWay({ ...way, legs: way.legs.filter((_, i) => i !== index) })}>
								<MaterialCommunityIcons name="close" size={20} color={theme.error} />
							</TouchableOpacity>
						</View>
					)}
					ListFooterComponent={
						<View style={{ gap: 10 }}>
							<TouchableOpacity
								onPress={() => setStep("route")}
								style={{ ...row, justifyContent: "center", backgroundColor: "transparent", borderWidth: 2, borderStyle: "dashed", borderColor: "#c4c9d2" }}
							>
								<MaterialCommunityIcons name="plus" size={20} color={theme.secondary} />
								<Text style={text}>{way.legs.length ? "Add a transfer bus" : "Add a bus"}</Text>
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

			{step === "route" ? (
				<View style={{ flex: 1 }}>
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
										setDraft({ route: item })
										setStep("direction")
									}}
								>
									<View style={{ minWidth: 44, height: 28, borderRadius: 7, backgroundColor: `#${(item.routeColor || "003566").replace("#", "")}`, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 }}>
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

			{step === "direction" ? (
				directionsLoading ? (
					<CustomLoadingIndicator />
				) : (
					<View style={{ padding: 16, gap: 10 }}>
						{[0, 1].map((direction) => {
							const path = directions?.[direction]
							if (!path) return null
							return (
								<TouchableOpacity
									key={`dir-${direction}`}
									style={row}
									onPress={() => {
										setDraft({ ...draft, direction: direction as 0 | 1 })
										setStep("board")
									}}
								>
									<MaterialCommunityIcons name="arrow-right-bold" size={22} color={theme.primaryDark} />
									<View style={{ flex: 1, paddingVertical: 10 }}>
										<Text style={text}>towards {path.headSign}</Text>
										<Text style={{ ...text, opacity: 0.6, fontSize: 12 }}>
											{path.busStopList?.length || 0} stops · from {path.busStopList?.at(0)?.stopName}
										</Text>
									</View>
								</TouchableOpacity>
							)
						})}
						{!directions?.some(Boolean) ? <Text style={{ ...text, textAlign: "center", marginTop: 20 }}>Couldn't load this route, go back and try again</Text> : null}
					</View>
				)
			) : null}

			{step === "board" || step === "alight" ? (
				<FlatList
					contentContainerStyle={{ padding: 16, gap: 6 }}
					data={(() => {
						const stops = directions?.[draft.direction as number]?.busStopList || []
						if (step === "board") return stops.slice(0, -1)
						const board_index = stops.findIndex((e) => e.stopId === draft.board?.stopId)
						return stops.slice(board_index + 1)
					})()}
					keyExtractor={(e, i) => `${e.stopId}-${i}`}
					ListHeaderComponent={
						step === "alight" ? <Text style={{ ...text, opacity: 0.6, fontSize: 12, marginBottom: 4 }}>GETTING ON AT {draft.board?.stopName}</Text> : null
					}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={{ ...row, minHeight: 46 }}
							onPress={() => {
								if (step === "board") {
									setDraft({ ...draft, board: item })
									setStep("alight")
								} else finishLeg(item)
							}}
						>
							<MaterialCommunityIcons name="bus-stop" size={20} color={theme.primaryDark} />
							<Text style={{ ...text, flex: 1 }} numberOfLines={1}>
								{item.stopName}
							</Text>
						</TouchableOpacity>
					)}
				/>
			) : null}
		</View>
	)
}
