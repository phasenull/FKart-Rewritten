import { Modal, Text, TouchableOpacity, View } from "react-native"
import CardTypes from "../common/enums/CardTypes"
import Application from "../common/Application"
import SegmentedButtons from "./SegmentedButtons"
import { Langs } from "../common/enums/Langs";
import { useContext } from "react";
import { TranslationsContext, getTranslationsFromLang } from "../common/contexts/TranslationsContext";

export default function SelectLangModal(props: { defaultValue: Langs; visible?: boolean; onSelect: (value: Langs) => void; onDismiss: () => void }) {
	const styles = Application.styles
	const { defaultValue, visible, onSelect, onDismiss } = props
	const {translations} = useContext(TranslationsContext)
	if (!visible) {
		return null
	}
	return (
		<Modal transparent={true}>
			<View className="p-4 w-80 self-center my-auto rounded-[16px] flex-col items-center justify-center" style={{ backgroundColor: styles.dark, elevation: 10 }}>
				<Text style={{ color: Application.styles.secondary, fontWeight: "600", fontSize: 18, marginBottom: 4 * 4 }}>{translations.select_language}</Text>
				<SegmentedButtons
					paddingX={2*4}
					defaultKey={defaultValue}
					values={Object.keys(Langs)
						.map((e) => ({
							label: getTranslationsFromLang(e as Langs | undefined).languages.locale,
							key: e,
							value: e,
						}))}
					onSelect={({ label, key, value }) => {
						onSelect(value)
					}}
					onDismiss={onDismiss}
				/>
				<TouchableOpacity className="rounded-[12px] mt-4 justify-center h-12 px-4" onPress={onDismiss} style={{ backgroundColor: styles.warning }}>
					<Text style={{ color: styles.secondary, fontSize: 18, fontWeight: "600" }}>{translations.cancel}</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	)
}
