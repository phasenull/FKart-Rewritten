import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native"
import Application from "../../common/Application"
import { StatusBar } from "expo-status-bar"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useContext, useEffect, useState } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import User from "../../common/classes/User"

import KentKartAuthValidator from "../../components/validators/KentKartAuthValidator"
import SecondaryText from "../../components/root/SecondaryText"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { UserContext } from "../../common/contexts/UserContext"
import AuthPanel from "../../components/screen_components/auth/AuthPanel"
import { FKartContext } from "../../common/contexts/FKartContext"
import FKartAuthValidator from "../../components/validators/FKartAuthValidator"
import CardJSONData from "../../components/screen_components/card_details/CardJSONData"

export default function FKartTesting(props: { navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	const { fkartUser, captchaManager, fetchRefreshToken } = useContext(FKartContext)
	return (
		// <FKartAuthValidator
		// 	else={
		// 		<SafeAreaView>
		// 			<StatusBar style="auto" />
		// 			<SecondaryText>
		// 				AuthRequired
		// 			</SecondaryText>
		// 		</SafeAreaView>
		// 	}
		// >
		<SafeAreaView className="items-center justify-center flex-1">
			<MaterialCommunityIcons name="help" size={48 * 4} style={{ opacity: 0.3, marginBottom: 2 * 4 }} />
			<SecondaryText>FKart Testing</SecondaryText>
			<ScrollView className="gap-y-5">
				<Text selectable={true}>captcha_session:{JSON.stringify(captchaManager.__captchaValidateQuery.error?.response?.data || captchaManager.captchaSession, undefined, 4)}</Text>

				<TextInput placeholder="captcha_code" defaultValue={captchaManager.captchaSession?.__code} onChangeText={(codeInput)=>captchaManager.setCode(codeInput)}></TextInput>
				<View className="flex-row gap-x-4">
					<TouchableOpacity onPress={() => captchaManager.challange()}>
						<SecondaryText>Fetch Captcha</SecondaryText>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => captchaManager.validate()}>
						<SecondaryText>Validate</SecondaryText>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
		// </FKartAuthValidator>
	)
}
