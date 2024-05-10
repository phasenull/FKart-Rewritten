import { ScrollView, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native"
import Application from "../src/common/Application"
import { StatusBar } from "expo-status-bar"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useContext, useEffect, useState } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import User from "../src/common/classes/User"

import KentKartAuthValidator from "../src/components/validators/KentKartAuthValidator"
import SecondaryText from "../src/components/root/SecondaryText"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { UserContext } from "../src/common/contexts/UserContext"
import AuthPanel from "../src/components/screen_components/auth/AuthPanel"
import { FKartContext } from "../src/common/contexts/FKartContext"
import FKartAuthValidator from "../src/components/validators/FKartAuthValidator"
import CardJSONData from "../src/components/screen_components/card_details/CardJSONData"
import Logger from "../src/common/Logger"

export default function FKartTesting(props: { navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	const { fkartUser, captchaManager, fetchRefreshToken, userManager } = useContext(FKartContext)
	Logger.warning("userManager.pushUserQuery",userManager.__pushUserQuery.error?.response?.data?.result?.error)
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