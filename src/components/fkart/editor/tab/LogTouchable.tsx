import { ThemeContext } from "common/contexts/ThemeContext"
import Log from "common/interfaces/FKart/Log"
import { deltaTime } from "common/util"
import SecondaryText from "components/reusables/SecondaryText"
import { useContext } from "react"
import { Text, TouchableOpacity } from "react-native"

export default function LogTouchable(props: { log: Log }) {
	const { log } = props
	const {theme} = useContext(ThemeContext)
	if (!log) {
		return null
	}

	const dateText = ((Date.now()-log.at) < 24*60*60*1_000)? deltaTime(Date.now()-log.at) : new Date(log.at).toLocaleDateString()
	return (
		<TouchableOpacity
			onPress={() => alert(
				`at: ${new Date(log.at).toUTCString()}`
				+ `\nevent_name: ${log.string}`
				+ `\nip: ${log.ip}`
				+ `\nid: ${log.id}`
				+ `\nsession_id: ${log.refresh_token_id}`
				+ `\nargs: ${JSON.stringify(log.args || [], undefined, 4)}`)}
			className="flex-row justify-between"
		>
			<Text style={{fontWeight:"600",color:theme.secondary}}>{log.string}</Text>
			<Text style={{fontWeight:"600",color:theme.secondary}}>{dateText}</Text>
		</TouchableOpacity>
	)
}
