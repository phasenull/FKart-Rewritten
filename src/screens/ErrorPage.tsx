import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useContext } from "react"
import { Text, TouchableOpacity, View } from "react-native"

export default function ErrorPage(props: { error: { title?: string; description?: string }; retry?: () => void; icon?: any }) {
	const error = props.error
	const icon =props.icon
	const title = error.title || "Unknown Error"
	const description = error.description || "No description provided"
	const retry = props.retry
	const { theme } = useContext(ThemeContext)
	return (
		<View className="flex-1 items-center justify-center" style={{ backgroundColor: theme.dark }}>
			<MaterialIcons name={icon || "warning-amber"} color={theme.secondary} style={{ opacity: 0.3 }} size={48} />
			<Text style={{ fontWeight: "800",fontSize:24,color:theme.error }}>{title}</Text>
			{retry ? <TouchableOpacity onPress={retry} className="flex-col">
				<MaterialCommunityIcons name="refresh" color={theme.secondary} style={{ opacity: 0.3 }} size={48} />
				<Text style={{fontSize:16,color:theme.text.secondary,fontWeight:"600"}}>
					Retry
				</Text>
			</TouchableOpacity> : null}
			<Text style={{fontSize:18,color:theme.text.secondary,fontWeight:"600"}}>{description}</Text>
		</View>
	)
}
