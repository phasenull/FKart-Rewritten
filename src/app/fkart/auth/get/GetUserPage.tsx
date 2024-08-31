import {  View } from "react-native"
import SimplyButton from "components/ui/SimplyButton"
import SimplyTextInput from "components/ui/SimplyTextInput"
import { useContext, useState } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import SecondaryText from "components/reusables/SecondaryText"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import TwoFASessionModal from "../TwoFASessionModal"
import { useFKartAuthStore } from "common/stores/FKartAuthStore"
import useGetUser from "common/hooks/fkart/auth/useGetUser"

export default function GetUserPage(props: { goBack: () => void }) {
	const { clear2FA } = useFKartAuthStore()
	const {mutate,data,error,isLoading} = useGetUser()
	const { theme } = useContext(ThemeContext)
	const { translations } = useContext(TranslationsContext)
	const [inputPassword, setInputPassword] = useState<string | undefined>()
	const [inputEmail, setInputEmail] = useState<string | undefined>()
	function clearAll() {
		setInputPassword(undefined)
		setInputEmail(undefined)
		clear2FA()
	}
	return (
		<View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.dark }}>
			<TwoFASessionModal
				error={error}
				email={inputEmail?.toLowerCase() as string}
				processing={isLoading}
				onDissmiss={clearAll}
				onSave={(code) => mutate({username:inputEmail as string,password:inputPassword as string,twoFA_code:code})}
			/>
			<View style={{ width: "80%" }}>
				<SimplyTextInput
					onChangeText={setInputEmail}
					inputMode="email"
					autoComplete="email"
					placeholder={translations.input_fields.email}
					leftIcon={<MaterialCommunityIcons name="email" color={theme.secondary} size={20} />}
				/>
				<SimplyTextInput
					onChangeText={setInputPassword}
					inputMode="text"
					autoComplete="password"
					placeholder={translations.input_fields.password}
					leftIcon={<MaterialCommunityIcons name="key" color={theme.secondary} size={20} />}
				/>
			</View>
			<SecondaryText style={{ color: theme.error }}>{error as string}</SecondaryText>
			<SimplyButton
				className="mb-12"
				text={translations.signin}
				disabled={isLoading}
				processing={isLoading}
				processingText={translations.signin + "ing"}
				onPress={() => mutate({username:inputEmail as string,password:inputPassword as string})}
				size="medium"
			/>
			<SimplyButton text="<" onPress={props.goBack} />
		</View>
	)
}
