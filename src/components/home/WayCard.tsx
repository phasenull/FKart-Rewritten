import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useLegStatus, Way, WayLeg } from "common/ways"
import { router } from "expo-router"
import { useContext } from "react"
import { Text, TouchableOpacity, View } from "react-native"

function LegRow(props: { leg: WayLeg; index: number; isLast: boolean }) {
	const { leg, index, isLast } = props
	const { theme } = useContext(ThemeContext)
	const { data, isLoading, isError } = useLegStatus(leg)
	let status = "Loading…"
	let status_color = theme.secondary
	if (isError && !data) {
		status = "Couldn't load this route"
		status_color = theme.error
	} else if (data) {
		if (data.bus && data.stops_away !== undefined) {
			status =
				data.stops_away === 0
					? `${data.bus.plateNumber} is at ${leg.board_stop_name}`
					: `${data.bus.plateNumber} · ${data.stops_away} stop${data.stops_away === 1 ? "" : "s"} before ${leg.board_stop_name}`
		} else if (data.next_departure) {
			status = `No bus coming · next departure ${data.next_departure}`
			status_color = theme.error
		} else {
			status = "No bus coming"
			status_color = theme.error
		}
	} else if (!isLoading) {
		status = "No data"
	}
	return (
		<TouchableOpacity
			onPress={() =>
				router.navigate({
					pathname: "/map_details",
					params: { force_route_code: leg.route_code, force_direction: `${leg.direction}`, headerTitle: leg.headsign },
				})
			}
			className="flex-row items-center"
			style={{ paddingVertical: 8, gap: 10 }}
		>
			<View style={{ alignItems: "center", width: 46 }}>
				<View
					style={{
						minWidth: 46,
						height: 28,
						borderRadius: 7,
						backgroundColor: leg.color || theme.secondary,
						alignItems: "center",
						justifyContent: "center",
						paddingHorizontal: 4,
					}}
				>
					<Text style={{ color: theme.white, fontWeight: "800", fontSize: 14 }}>{leg.route_code}</Text>
				</View>
			</View>
			<View style={{ flex: 1 }}>
				<Text numberOfLines={1} style={{ color: theme.secondary, fontWeight: "800", fontSize: 14 }}>
					{leg.board_stop_name} → {leg.alight_stop_name}
				</Text>
				<Text numberOfLines={2} style={{ color: status_color, fontWeight: "700", fontSize: 12, opacity: status_color === theme.secondary ? 0.65 : 1 }}>
					{status}
				</Text>
			</View>
			{!isLast ? null : <MaterialCommunityIcons name="chevron-right" size={22} color={theme.secondary} style={{ opacity: 0.5 }} />}
		</TouchableOpacity>
	)
}

export default function WayCard(props: { way: Way }) {
	const { way } = props
	const { theme } = useContext(ThemeContext)
	return (
		<View style={{ backgroundColor: theme.white, borderRadius: 16, padding: 14, elevation: 2 }}>
			<View className="flex-row items-center justify-between">
				<View className="flex-row items-center" style={{ gap: 8, flex: 1 }}>
					<MaterialCommunityIcons name="map-marker-path" size={22} color={theme.primaryDark} />
					<Text numberOfLines={1} style={{ color: theme.secondary, fontWeight: "800", fontSize: 16, flex: 1 }}>
						{way.name}
					</Text>
				</View>
				<Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "800", fontSize: 12, marginRight: 8 }}>
					{way.legs.length === 1 ? "direct" : `${way.legs.length - 1} transfer${way.legs.length > 2 ? "s" : ""}`}
				</Text>
				<TouchableOpacity
					hitSlop={12}
					onPress={() => router.navigate({ pathname: "/way_editor", params: { way_id: way.id } })}
					accessibilityLabel={`Edit ${way.name}`}
				>
					<MaterialCommunityIcons name="pencil" size={20} color={theme.secondary} style={{ opacity: 0.6 }} />
				</TouchableOpacity>
			</View>
			{way.legs.map((leg, i) => (
				<View key={`${way.id}-${i}`}>
					{i > 0 ? (
						<View className="flex-row items-center" style={{ gap: 6, paddingLeft: 12 }}>
							<MaterialCommunityIcons name="transfer-down" size={16} color={theme.secondary} style={{ opacity: 0.5 }} />
							<Text style={{ color: theme.secondary, opacity: 0.5, fontWeight: "700", fontSize: 12 }}>transfer at {way.legs[i - 1].alight_stop_name}</Text>
						</View>
					) : null}
					<LegRow leg={leg} index={i} isLast={i === way.legs.length - 1} />
				</View>
			))}
		</View>
	)
}
