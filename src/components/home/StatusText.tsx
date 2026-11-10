import { ThemeContext } from "common/contexts/ThemeContext"
import { NEXT_BUS_COLOR, StatusPart, StatusTone } from "common/ways"
import { Fragment, useContext } from "react"
import { Text } from "react-native"

/** colored status line: "Left HH:MM" red, "N stops away" green, "next HH:MM" muted; amber / red when no bus is coming */
export default function StatusText(props: { tone: StatusTone; parts: StatusPart[]; prefix?: string; numberOfLines?: number }) {
	const { theme } = useContext(ThemeContext)
	const muted = "#5b6b80"
	const base = props.tone === "warn" ? NEXT_BUS_COLOR : props.tone === "bad" ? theme.error : muted
	const colorOf = (part: StatusPart) => (part.kind === "left" ? theme.error : part.kind === "away" ? "#2f8a29" : base)
	return (
		<Text numberOfLines={props.numberOfLines ?? 2} style={{ fontWeight: "800", fontSize: 12, color: base }}>
			{props.prefix ? <Text style={{ color: muted }}>{props.prefix} · </Text> : null}
			{props.parts.map((part, i) => (
				<Fragment key={`p-${i}`}>
					{i > 0 ? <Text style={{ color: muted }}> · </Text> : null}
					<Text style={{ color: colorOf(part) }}>{part.text}</Text>
				</Fragment>
			))}
		</Text>
	)
}
