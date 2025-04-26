import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useContext } from "react"
import { Text, TouchableOpacity, View } from "react-native"

export default function ErrorPage(props: {
	error: {
		title?: string
		description?: string
	}
	retry?: () => void
	icon?: any
	other?:  { func: () => void,description:string,icon:string }
}) {
	const error = props.error
	const icon = props.icon
	const title = error.title || "Unknown Error"
	const description = error.description || "No description provided"
	const retry = props.retry
	const other = props.other
	const { theme } = useContext(ThemeContext)
	return (
		<View className="flex-1 self-center items-center justify-center" style={{}}>
			<MaterialIcons name={icon || "warning-amber"} color={theme.secondary} style={{ opacity: 0.3 }} size={32 * 4} />
			<Text style={{ fontWeight: "800", fontSize: 24, color: theme.error }}>{title}</Text>
			<View className="flex-row justify-between">
			{retry ? (
				<TouchableOpacity onPress={retry} className="my-6">
					<MaterialCommunityIcons name="refresh" color={theme.secondary} style={{ opacity: 0.3 }} size={24 * 4} />
					<Text style={{ fontSize: 16, color: theme.text.secondary, fontWeight: "600", bottom: 4 * 4 }} className="text-center">
						Retry
					</Text>
				</TouchableOpacity>
			) : null}
			{other ? (
				<TouchableOpacity onPress={other.func} className="my-6">
					<MaterialCommunityIcons name={other.icon as any} color={theme.secondary} style={{ opacity: 0.3 }} size={24 * 4} />
					<Text style={{ fontSize: 16, color: theme.text.secondary, fontWeight: "600", bottom: 4 * 4 }} className="text-center">
						{other?.description}
					</Text>
				</TouchableOpacity>
			) : null}
			</View>
			<Text style={{ fontSize: 18, color: theme.text.secondary, fontWeight: "500" }}>
				Error Details:{"\n"}
				{description}
			</Text>
		</View>
	)
}
