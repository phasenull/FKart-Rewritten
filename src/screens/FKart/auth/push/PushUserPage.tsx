import { View } from "react-native"
import Application from "../../../../common/Application"
import Button from "../../../../components/ui/Button"
import SecondaryText from "../../../../components/root/SecondaryText"
import TextInput from "../../../../components/ui/TextInput"

export default function PushUserPage(props: { goBack: () => void }) {
	return (
		<View className="flex-1 justify-center items-center" style={{ backgroundColor: Application.styles.dark }}>
			<TextInput>

			</TextInput>
			<Button text="<" onPress={props.goBack} />
		</View>
	)
}
