import { ButtonProps, Text } from "react-native"
import Application from "../common/Application"
import { TouchableOpacity, TouchableOpacityProps } from "react-native-gesture-handler"

export default function Button(props: { text: string; children?: any; type?: "primary" | "secondary" | "text" } & TouchableOpacityProps) {
	const type = props.type || "primary"
	const text = props.text || "props.text"
	const bg_color = type === "primary" ? Application.styles.primary : Application.styles.secondary
	if (props.type === "text") {
		return (
			<TouchableOpacity onPress={props.onPress} className="flex-row px-8 py-6 -bottom-4 gap-x-1 items-center justify-center">
				<Text style={{ fontWeight: "800", fontSize: 16, color: Application.styles.secondary, opacity: 0.4 }}>{text}</Text>
			</TouchableOpacity>
		)
	}
	return (
		<TouchableOpacity
			activeOpacity={0.5}
			style={{
				borderRadius: 16,
				paddingHorizontal: 32,
				paddingVertical: 12,
				backgroundColor: bg_color,
			}}
			onPress={props.onPress}
		>
			<Text
				style={{
					color: Application.styles.white,
					fontWeight: "600",
				}}
				className="text-[36px] text-center"
			>
				{text}
			</Text>
			{props.children}
		</TouchableOpacity>
	)
}