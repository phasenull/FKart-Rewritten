import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ThemeContext } from "common/contexts/ThemeContext"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import { useFKartAuthStore } from "common/stores/FKartAuthStore"
import SecondaryText from "components/reusables/SecondaryText"
import SimplyButton from "components/ui/SimplyButton"
import { useContext, useState } from "react"
import { Modal, TextInput, View } from "react-native"
import Animated, { BounceIn, BounceOut } from "react-native-reanimated"

export default function TwoFASessionModal(props: {processing:boolean, onDissmiss: () => void; visible?: boolean; onSave: (code: string) => void; error?: unknown; email: string }) {
	const { theme } = useContext(ThemeContext)
	const { translations } = useContext(TranslationsContext)
	const twoFA = useFKartAuthStore((state) => state.twoFA)
	const visible = props.visible || twoFA?.session_id
	const [selectionIndex, setSelectionIndex] = useState<{ end: number; start: number }>({ end: 0, start: 0 })
	const [text, setText] = useState<string>("")
	if (!visible) {
		return
	}
	return (
		<Modal transparent={true} visible={props.visible} style={{ backgroundColor: theme.success }}>
			<Animated.View
				entering={BounceIn.duration(250)}
				style={{ elevation: 10, backgroundColor: theme.white, borderRadius: 16, width: "90%" }}
				className={"self-center items-center my-auto py-4"}
				exiting={BounceOut.duration(250)}
			>
				<SecondaryText style={{ fontSize: 24 }}>2FA Code Required!</SecondaryText>
				<MaterialCommunityIcons name="lock" color={theme.secondary} size={24 * 4} />

				<SecondaryText style={{ fontSize: 18, textAlign: "center", color: theme.success }}>We've sent {props.email || "error@error"} an email containing your secret code!</SecondaryText>
				<SecondaryText style={{ fontSize: 12, opacity: 0.3 }}>ref-no: {twoFA?.session_id || "error"}</SecondaryText>
				<View className="flex-row mt-4 px-12 justify-center">
					<TextInput
						inputMode="numeric"
						selectTextOnFocus={false}
						style={{ opacity: 0, userSelect: "none", letterSpacing: 38 }}
						className="absolute bg-red-400 w-full h-full text-left"
						value={text}
						autoComplete="one-time-code"
						onSelectionChange={(e) => {
							setSelectionIndex(e.nativeEvent.selection)
						}}
						onChangeText={(new_input) => {
							setText(new_input.slice(0, 6))
						}}
					/>
					{(text + "-".repeat(6))
						.slice(0, 6)
						.split("")
						.map((e, index) => (
							<View
								pointerEvents="none"
								key={index}
								style={{
									backgroundColor: index >= selectionIndex.start && index <= selectionIndex.end ? theme.success : theme.dark,
									borderRadius: 8,
								}}
								className="h-12 mx-[3] flex-1 justify-center items-center"
							>
								<SecondaryText>{e}</SecondaryText>
							</View>
						))}
				</View>
				<SecondaryText style={{ color: theme.error }} className="my-4">
					{props.error as string}
				</SecondaryText>
				<View className="self-center gap-x-4 justify-center flex-row">
					<SimplyButton onPress={() => props.onDissmiss()} text={translations.cancel} color={theme.error} size="medium"/>
					<SimplyButton onPress={() => props.onSave(text)} processing={props.processing} text={translations.ok} size="medium"/>
				</View>
			</Animated.View>
		</Modal>
	)
}
