import { Text, TouchableOpacity, TouchableOpacityProps, TouchableWithoutFeedback, View } from "react-native"

import { useContext, useEffect } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"

export default function SimplyButton(
	props: {
		text: string
		children?: any
		type?: "primary" | "secondary" | "text"
		rounded?: boolean
		size?: "large" | "medium"
		processing?: boolean
		processingText?: string
		processingTimeout?: number
		color?: string
		disabled?: boolean
	} & TouchableOpacityProps
) {
	const type = props.type || "primary"
	const text = props.text || "props.text"
	const disabled = props.disabled
	const { theme } = useContext(ThemeContext)
	const bg_color = props.color || (type === "primary" ? theme.primary : theme.secondary)
	const size = props.size === "medium" ? "medium" : "large"
	const processing = props.processing
	const processingText = props.processingText || text
	if (props.type === "text") {
		return (
			<TouchableOpacity className="flex-row px-8 py-6 -bottom-4 gap-x-1 items-center justify-center" {...props}>
				<Text style={{ fontWeight: "800", fontSize: 16, color: theme.secondary, opacity: 0.4 }}>{text}</Text>
			</TouchableOpacity>
		)
	}
	if (size === "medium") {
		return (
			<TouchableOpacity disabled={processing} {...props}>
				<View
					style={{
						backgroundColor: processing || disabled ? theme.secondary : bg_color,
						opacity: processing || disabled ? 0.7 : 1,
					}}
					className="px-4 py-2 rounded-lg flex-row"
				>
					{processing ? <CustomLoadingIndicator size={14} style={{ marginRight: 2 * 4 }} color={theme.text.white} /> : null}
					<Text className="mx-auto text-center" style={{ fontWeight: "800", fontSize: 18, color: theme.text.white }}>
						{processing ? processingText : text}
					</Text>
				</View>
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
			{...props}
		>
			<Text
				style={{
					color: theme.white,
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
