import { TextInput, TextInputProps, View } from "react-native"
import Application from "common/Application"
import { useContext, useState } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"
import SecondaryText from "components/root/SecondaryText"
import { Text } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Icon } from "react-native-vector-icons/Icon"

export default function SimplyTextInput(props: { label?: string; leftIcon?: any } & TextInputProps) {
	const { theme } = useContext(ThemeContext)
	const [isFocused, setIsFocused] = useState(false)
	const [input, setInput] = useState<undefined | string>(undefined)
	return (
		<View className="mt-5 flex-row">
			<View className="absolute z-20 self-center ml-2 opacity-30 content-center">{props.leftIcon || null}</View>
			<TextInput
				onFocus={(e) => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				style={{
					color: theme.secondary,
					borderColor: isFocused ? theme.primaryDark : theme.secondary,
					backgroundColor: theme.dark,
					fontWeight: "500",
				}}
				placeholderTextColor={theme.secondaryDark}
				className="border-2 w-full h-16 rounded-[10px] px-8 py-2 shadow-2xl"
				{...props}
				onChangeText={(e) => {
					setInput(e)
					if (props?.onChangeText) {
						props.onChangeText(e)
					}
				}}
				value={input}
				placeholder=""
			/>
			{isFocused ? (
				// MARK: Top placeholder
				<SecondaryText
					className="absolute left-4"
					style={{
						backgroundColor: theme.dark,
						borderColor: isFocused ? theme.primaryDark : theme.secondary,
						borderTopWidth: 0.5 * 4,
						borderLeftWidth: 0.5 * 4,
						borderRightWidth: 0.5 * 4,
						borderTopRightRadius: 2 * 4,
						borderTopLeftRadius: 2 * 4,
						paddingHorizontal: 1 * 4,
						top: -4.5 * 4,
						fontWeight: "800",
						textAlign: "center",
						color: theme.secondaryDark,
					}}
				>
					{props.placeholder || "unknown placeholder"}
				</SecondaryText>
			) : ["", undefined].includes(input) ? (
				// center placeholder
				<View
					// pointerEvents: none does not work on Text components, see more @ https://stackoverflow.com/q/30041111
					className="absolute self-start justify-center h-full ml-8"
					style={{
						pointerEvents: "none",
					}}
				>
					<Text
						className=""
						style={{
							// backgroundColor: "transparent",
							textAlign: "center",
							textAlignVertical: "center",
							fontWeight: "800",
							opacity: 0.3,
							color: theme.secondaryDark,
						}}
					>
						{props.placeholder || "unknown placeholder"}
					</Text>
				</View>
			) : null}
		</View>
	)
}
