import { Modal, Text, TouchableOpacity, View } from "react-native"
import CardTypes from "common/enums/CardTypes";
import SegmentedButtons from "components/reusables/SegmentedButtons";
import { useContext } from "react";
import { ThemeContext } from "common/contexts/ThemeContext";

export default function SelectCardTypeModal(props: { defaultValue: CardTypes; visible?: boolean; onSelect: (value: CardTypes) => void; onDismiss: () => void }) {
const {theme} = useContext(ThemeContext)

	const { defaultValue, visible, onSelect, onDismiss } = props
	if (!visible) {
		return null
	}
	return (
		<Modal transparent={true}>
			<View className="p-4 w-80 self-center my-auto rounded-[16px] flex-col items-center justify-center" style={{ backgroundColor: theme.dark, elevation: 10 }}>
				<Text style={{ color: theme.secondary, fontWeight: "600", fontSize: 18, marginBottom: 4 * 4 }}>Select Card Type</Text>
				<SegmentedButtons
					paddingX={2*4}
					defaultKey={defaultValue}
					values={Object.keys(CardTypes)
						.filter((e) => !["undefined", "QR"].includes(e))
						.map((e) => ({
							label: e,
							key: e,
							value: e,
						}))}
					onSelect={({ label, key, value }) => {
						onSelect(value)
					}}
					onDismiss={onDismiss}
				/>
				<TouchableOpacity className="rounded-[12px] mt-4 justify-center h-12 px-4" onPress={onDismiss} style={{ backgroundColor: theme.error }}>
					<Text style={{ color: theme.secondary, fontSize: 18, fontWeight: "600" }}>Cancel</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	)
}
