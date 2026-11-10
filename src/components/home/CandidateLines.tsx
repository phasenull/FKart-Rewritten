import { ThemeContext } from "common/contexts/ThemeContext"
import { Candidate, NEXT_BUS_COLOR, optionKey } from "common/ways"
import { useContext } from "react"
import { Text, View } from "react-native"

function hhmm(ms: number) {
	const d = new Date(ms)
	return `${`${d.getHours()}`.padStart(2, "0")}:${`${d.getMinutes()}`.padStart(2, "0")}`
}

/**
 * the next buses you can catch on a part of a way, soonest first, one line each with its route badge:
 * live: "2 stops away · ~4 min · left 19:55", scheduled: "departs 20:10 · ~20:24 at your stop"
 */
export default function CandidateLines(props: { candidates: Candidate[]; colors: Record<string, string>; loading?: boolean; emptyText?: string }) {
	const { theme } = useContext(ThemeContext)
	const muted = "#5b6b80"
	if (props.loading && !props.candidates.length) return <Text style={{ color: muted, fontWeight: "800", fontSize: 12 }}>Loading…</Text>
	if (!props.candidates.length) return <Text style={{ color: theme.error, fontWeight: "800", fontSize: 12 }}>{props.emptyText || "No buses scheduled"}</Text>
	return (
		<View style={{ gap: 4 }}>
			{props.candidates.map((c, i) => {
				const minutes = Math.max(0, Math.round((c.eta - Date.now()) / 60000))
				return (
					<View key={`${optionKey(c.option)}-${c.kind}-${c.departure}-${i}`} className="flex-row items-center" style={{ gap: 6 }}>
						<View style={{ minWidth: 34, height: 20, borderRadius: 5, paddingHorizontal: 4, backgroundColor: props.colors[optionKey(c.option)] || theme.secondary, alignItems: "center", justifyContent: "center" }}>
							<Text style={{ color: theme.white, fontWeight: "800", fontSize: 11 }}>{c.option.route_code}</Text>
						</View>
						{c.kind === "live" ? (
							<Text numberOfLines={1} style={{ flex: 1, fontWeight: "800", fontSize: 12, color: muted }}>
								<Text style={{ color: "#2f8a29" }}>{c.stops_away === 0 ? "at your stop" : `${c.stops_away} stop${c.stops_away === 1 ? "" : "s"} away`}</Text>
								{` · ~${minutes} min`}
								{c.departure ? (
									<Text>
										{" · "}
										<Text style={{ color: theme.error }}>left {c.departure}</Text>
									</Text>
								) : null}
							</Text>
						) : (
							<Text numberOfLines={1} style={{ flex: 1, fontWeight: "800", fontSize: 12, color: muted }}>
								<Text style={{ color: NEXT_BUS_COLOR }}>
									{c.tomorrow ? "tomorrow " : ""}departs {c.departure}
								</Text>
								{` · ~${hhmm(c.eta)} at your stop`}
							</Text>
						)}
					</View>
				)
			})}
		</View>
	)
}
