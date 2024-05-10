import { useContext, useEffect, useState } from "react"
import Application from "../../common/Application"
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native"
import { formatAlias } from "../../util"
import { ThemeContext } from "../../common/contexts/ThemeContext"

export default function InputModal(props: {
	visible?: boolean
	onDismiss: () => void
	onSave?: (text: string) => void
	defaultValue?: string
	formatter?: (input: string) => string
	config?: { confirm: string; cancel: string; title: string; placeholder?: string }
}) {
	const {theme} = useContext(ThemeContext)
	const [input, setInput] = useState(props.defaultValue || "")
	function formatInput(input:string) {
		const result = props.formatter ? props.formatter(input) || input : input
		return result
	}
	const { onSave, onDismiss } = props
	if (!props.visible) {
		return null
	}
	return (
		<Modal transparent={true} onDismiss={props.onDismiss}>
			<View className="p-4 w-80 self-center my-auto rounded-[16px] flex-col items-center justify-center" style={{ backgroundColor: theme.dark, elevation: 10 }}>
				<Text className="text-center" style={{ color: theme.secondary, fontSize: 18 }}>
					{props.config?.title || "unknown_key (config.description)"}
				</Text>
				<TextInput
					onChangeText={setInput}
					value={formatInput(input)}
					defaultValue={props.defaultValue}
					className="w-full h-16 my-4 px-4"
					placeholder={props.config?.placeholder || "Input your text here"}
					style={{ borderColor: theme.secondary, borderWidth: 2, borderRadius: 8, color: theme.secondary, fontSize: 18, fontWeight: "500" }}
				/>
				<View className="flex-row justify-center items-center gap-x-4">
					<TouchableOpacity className="rounded-[12px] items-center justify-center h-12 px-4" onPress={onDismiss} style={{ backgroundColor: theme.error }}>
						<Text style={{ color: theme.secondary, fontSize: 18, fontWeight: "600" }}>{props.config?.cancel || "Cancel"}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="rounded-[12px] items-center justify-center h-12 px-4"
						onPress={() => {
							if (onSave) {
								onSave(input)
							} else {
								onDismiss()
							}
						}}
						style={{ backgroundColor: theme.success }}
					>
						<Text style={{ color: theme.secondary, fontSize: 18, fontWeight: "600" }}>{props.config?.confirm || "OK"}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	)
}
