import { View } from "react-native"
import SimplyButton from "components/ui/SimplyButton"
import { useContext } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"
import { TranslationsContext } from "common/contexts/TranslationsContext"

export default function PushUserPage(props: { goBack: () => void }) {
	const {theme} = useContext(ThemeContext)
	const {translations} = useContext(TranslationsContext)
	return (
		<View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.dark }}>
			<SimplyButton text="<" onPress={props.goBack} />
		</View>
	)
}
