import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useContext } from "react"
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"


import Logger from "common/Logger"
import { FKartContext } from "common/contexts/FKartContext"
import SecondaryText from "components/root/SecondaryText"

export default function FKartTesting(props: { navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	const { fkartUser, captchaManager, fetchRefreshToken, userManager } = useContext(FKartContext)
	Logger.warning("userManager.pushUserQuery",(userManager.__pushUserQuery.error as any)?.response?.data?.result?.error)
	return (
		<View className="items-center justify-center flex-1">
			<SecondaryText className="mb-12">FKart Testing</SecondaryText>
			<ScrollView className="gap-y-5">
				<Text selectable={true}>captcha_session:{JSON.stringify(captchaManager.captchaSession, undefined, 4)}</Text>
				<TextInput placeholder="captcha_code" defaultValue={captchaManager.captchaSession?.__code} onChangeText={(codeInput) => captchaManager.setCode(codeInput)}></TextInput>
				<View className="flex-row gap-x-4">
					<TouchableOpacity onPress={() => captchaManager.challange()}>
						<SecondaryText>Fetch Captcha</SecondaryText>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => captchaManager.validate()}>
						<SecondaryText>Validate</SecondaryText>
					</TouchableOpacity>
				</View>
				<Text selectable={true}>credentials:{JSON.stringify(userManager.credentials || {}, undefined, 4)}</Text>
				<TextInput placeholder="fkart_email" onChangeText={(input) => userManager.setCredentials({ ...userManager.credentials, username: input })}></TextInput>
				<TextInput placeholder="fkart_password" onChangeText={(input) => userManager.setCredentials({ ...userManager.credentials, password: input })}></TextInput>
				<TextInput placeholder="fkart_2fa" onChangeText={(input) => userManager.setCredentials({ ...userManager.credentials, twoFA_code: input })}></TextInput>
				<View className="flex-row gap-x-4">
					<TouchableOpacity onPress={() => userManager.pushUser()}>
						<SecondaryText>Push</SecondaryText>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => null}>
						<SecondaryText>Get</SecondaryText>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => null}>
						<SecondaryText>Access</SecondaryText>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
		// </FKartAuthValidator>
	)
}
