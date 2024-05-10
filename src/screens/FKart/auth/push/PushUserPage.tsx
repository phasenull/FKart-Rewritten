import { View } from "react-native"
import Application from "../../../../common/Application"
import Button from "../../../../components/ui/Button"
import SecondaryText from "../../../../components/root/SecondaryText"

export default function PushUserPage(props: { goBack: () => void }) {
	console.log("hello")
	return (
		<View className="flex-1 justify-center items-center" style={{ backgroundColor: Application.styles.dark }}>

			<Button text="<" onPress={props.goBack} />
		</View>
	)
}
