import { View } from "react-native"
import SimplyButton from "components/ui/SimplyButton"
import SimplyTextInput from "components/ui/SimplyTextInput"
import { useContext } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"

export default function PushUserPage(props: { goBack: () => void }) {
	const {theme} = useContext(ThemeContext)
	return (
		<View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.dark }}>
			<SimplyTextInput>

			</SimplyTextInput>
			<SimplyButton text="<" onPress={props.goBack} />
		</View>
	)
}
