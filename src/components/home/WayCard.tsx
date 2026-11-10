import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import CandidateLines from "components/home/CandidateLines"
import { colorsFor, segmentCandidates, optionKey, optionQuery, useWayOptions, Way, WayOption } from "common/ways"
import { router } from "expo-router"
import { useContext } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useQueries } from "react-query"

/** a saved way on the home screen; the whole card opens the way map */
export default function WayCard(props: { way: Way }) {
	const { way } = props
	const { theme } = useContext(ThemeContext)
	const region = useKentKartAuthStore((state) => state.region) as string
	const { data: segmentOptions, isLoading: resolving } = useWayOptions(way)
	const colors = colorsFor(segmentOptions || [])
	const keys = Object.keys(colors)
	const unique: WayOption[] = keys.map((key) => (segmentOptions || []).flat().find((o) => optionKey(o) === key) as WayOption)
	const results = useQueries(unique.map((option) => optionQuery(region, option)))
	const paths = Object.fromEntries(keys.map((key, i) => [key, results[i]?.data]))
	const loading = resolving || results.some((r) => r.isLoading)
	const transfers = Math.max(0, way.segments.length - 1)

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={() => router.navigate({ pathname: "/way_map", params: { way_id: way.id } })}
			style={{ backgroundColor: theme.white, borderRadius: 16, padding: 14, elevation: 2, gap: 10 }}
		>
			<View className="flex-row items-center" style={{ gap: 8 }}>
				<MaterialCommunityIcons name="map-marker-path" size={22} color={theme.primaryDark} />
				<Text numberOfLines={1} style={{ color: theme.secondary, fontWeight: "800", fontSize: 16, flex: 1 }}>
					{way.name}
				</Text>
				<Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "800", fontSize: 12 }}>
					{transfers === 0 ? "direct" : `${transfers} transfer${transfers > 1 ? "s" : ""}`}
				</Text>
				<TouchableOpacity
					hitSlop={12}
					onPress={() => router.navigate({ pathname: "/way_editor", params: { way_id: way.id } })}
					accessibilityLabel={`Edit ${way.name}`}
					style={{ paddingLeft: 6 }}
				>
					<MaterialCommunityIcons name="pencil" size={20} color={theme.secondary} style={{ opacity: 0.6 }} />
				</TouchableOpacity>
			</View>
			{way.segments.map((segment, i) => {
				const options = segmentOptions?.[i] || []
				// next buses you can catch here, soonest first; routes hidden on the way map don't count
				const visible = options.filter((o) => !way.hidden?.includes(optionKey(o)))
				const candidates = segmentCandidates(segment, visible, paths)
				return (
					<View key={`seg-${i}`} style={{ gap: 4 }}>
						<Text numberOfLines={1} style={{ color: theme.secondary, fontWeight: "800", fontSize: 13 }}>
							{segment.from.name} → {segment.to.name}
						</Text>
						<View className="flex-row flex-wrap items-center" style={{ gap: 4 }}>
							{options.map((o) => (
								<View
									key={optionKey(o)}
									style={{ minWidth: 34, height: 22, borderRadius: 6, paddingHorizontal: 5, backgroundColor: colors[optionKey(o)], alignItems: "center", justifyContent: "center", opacity: way.hidden?.includes(optionKey(o)) ? 0.3 : 1 }}
								>
									<Text style={{ color: theme.white, fontWeight: "800", fontSize: 12, textDecorationLine: way.hidden?.includes(optionKey(o)) ? "line-through" : "none" }}>{o.route_code}</Text>
								</View>
							))}
						</View>
						<CandidateLines
							candidates={candidates}
							colors={colors}
							loading={loading}
							emptyText={!resolving && options.length === 0 ? "No direct bus between these stops" : undefined}
						/>
					</View>
				)
			})}
		</TouchableOpacity>
	)
}
