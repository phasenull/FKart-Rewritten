import { View } from "react-native"
import Button from "components/ui/Button"
import TextInput from "components/ui/TextInput"
import { useContext } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"

export default function PushUserPage(props: { goBack: () => void }) {
	const {theme} = useContext(ThemeContext)
	return (
		<View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.dark }}>
			<TextInput>

			</TextInput>
			<Button text="<" onPress={props.goBack} />
		</View>
	)
}
