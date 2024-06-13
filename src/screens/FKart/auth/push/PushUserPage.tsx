import { View } from "react-native"
import SimplyButton from "components/ui/SimplyButton"
import SimplyTextInput from "components/ui/SimplyTextInput"
import { useContext } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import { FKartContext } from "common/contexts/FKartContext"

export default function PushUserPage(props: { goBack: () => void }) {
	const {theme} = useContext(ThemeContext)
	const {translations} = useContext(TranslationsContext)
	const {userManager} = useContext(FKartContext)
	return (
		<View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.dark }}>
			<SimplyButton text="<" onPress={props.goBack} />
		</View>
	)
}
