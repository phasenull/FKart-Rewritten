import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { SafeAreaView } from "react-native-safe-area-context"
import SecondaryText from "../../../components/root/SecondaryText"
import { useContext } from "react"
import { TranslationsContext } from "../../../common/contexts/TranslationsContext"
import Button from "../../../components/Button"

export default function FKartAuthTypeSelector(props: { navigation: NativeStackNavigationProp<any> }) {
	const {translations} = useContext(TranslationsContext)
	return (
		<SafeAreaView className="flex-1 justify-center items-center">
			<StatusBar style="auto" />
			<SecondaryText>
				New around here? See what you're missing
			</SecondaryText>
			<Button text="Sign Up" />
		</SafeAreaView>)
}
