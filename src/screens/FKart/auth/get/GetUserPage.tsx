import { Keyboard, TouchableOpacity, View } from "react-native"
import SimplyButton from "components/ui/SimplyButton"
import SimplyTextInput from "components/ui/SimplyTextInput"
import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import SecondaryText from "components/root/SecondaryText"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { FKartContext } from "common/contexts/FKartContext"

export default function GetUserPage(props: { goBack: () => void }) {
	const {userManager} = useContext(FKartContext)
	const { theme } = useContext(ThemeContext)
	const { translations } = useContext(TranslationsContext)
	const [processing, setProcessing] = useState(false)
	const [error, setError] = useState<undefined | string>()
	const [inputPassword,setInputPassword] = useState<string|undefined>(undefined)
	const [inputEmail,setInputEmail] = useState<string|undefined>(undefined)
	function updateCredentials() {
		userManager.setCredentials({password:inputPassword,username:inputEmail})
	}
	useEffect(()=>{
		setProcessing(userManager.__getUserQuery.isRefetching || userManager.__getUserQuery.isFetching)
		setError((userManager.__getUserQuery?.error as any)?.response?.data?.result?.error)
		// console.log("userManager update!")
	},[userManager.__getUserQuery])
	useEffect(()=>{
		updateCredentials()
	},[inputPassword,inputEmail])
	return (
		<View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.dark }}>
			<View style={{ width: "80%" }}>
				<SimplyTextInput onChangeText={setInputEmail} inputMode="email" autoComplete="email" placeholder={translations.input_fields.email} leftIcon={<MaterialCommunityIcons name="email" color={theme.secondary} size={20} />} />
				<SimplyTextInput onChangeText={setInputPassword} inputMode="text" autoComplete="password" placeholder={translations.input_fields.password} leftIcon={<MaterialCommunityIcons name="key" color={theme.secondary} size={20} />} />
			</View>
			<SecondaryText style={{ color: theme.error }}>{error}</SecondaryText>
			<SimplyButton
				className="mb-12"
				text={translations.signin}
				disabled={processing}
				processing={processing}
				processingText={translations.signin + "ing"}
				onPress={() => {
					setProcessing(true)
					userManager.getUser()
				}}
				size="medium"
			/>
			<SimplyButton text="<" onPress={props.goBack} />
		</View>
	)
}
