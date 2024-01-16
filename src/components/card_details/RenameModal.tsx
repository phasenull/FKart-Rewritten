import { useState } from "react"
import Application from "../../common/Application"
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function RenameModal(props: { visible?: boolean; onDismiss: () => void; onSave?: (text: string) => void; defaultValue?:string }) {
	const styles = Application.styles
	const [input, setInput] = useState(props.defaultValue || "")
	const { onSave, onDismiss } = props
	if (!props.visible) {
		return null
	}
	return (
		<Modal transparent={true} onDismiss={props.onDismiss}>
			<View className="p-4 w-80 self-center my-auto rounded-[16px] flex-col items-center justify-center" style={{ backgroundColor: styles.dark, elevation: 10 }}>
				<Text className="text-center" style={{ color: styles.secondary, fontSize: 18 }}>
					Rename Card
				</Text>
				<TextInput
					onChangeText={setInput}
					defaultValue={props.defaultValue}
					className="w-full h-16 my-4 px-4"
					placeholder="My Favorite Card"
					style={{ borderColor: styles.secondary, borderWidth: 2, borderRadius: 8, color: styles.secondary, fontSize: 18, fontWeight: "500" }}
				/>
				<View className="flex-row justify-center items-center gap-x-4">
					<TouchableOpacity className="rounded-[12px] items-center justify-center h-12 px-4" onPress={onDismiss} style={{ backgroundColor: styles.warning }}>
						<Text style={{ color: styles.secondary, fontSize: 18, fontWeight: "600" }}>Cancel</Text>
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
						style={{ backgroundColor: styles.success }}
					>
						<Text style={{ color: styles.secondary, fontSize: 18, fontWeight: "600" }}>Save</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	)
}
