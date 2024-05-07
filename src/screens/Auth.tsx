import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native"
import Application from "../common/Application"
import { StatusBar } from "expo-status-bar"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useContext, useEffect, useState } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import User from "../common/classes/User"

import KentKartAuthValidator from "../components/validators/KentKartAuthValidator"
import SecondaryText from "../components/root/SecondaryText"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { UserContext } from "../common/contexts/UserContext"
import AuthPanel from "../components/screen_components/auth/AuthPanel"

export default function AuthPage(props: { navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	const theme = Application.theme
	const page_width = useWindowDimensions().width
	const translateX = useSharedValue(0)
	const styles = Application.styles
	function updatePage(index: number) {
		translateX.value = withTiming(page_width * (1 - index) - page_width, { duration: 250 })
	}
	useEffect(() => {
		updatePage(0)
	}, [])
	const {loggedUser} = useContext(UserContext)
	if (loggedUser) {
		navigation.replace("home")
		return <View>
			
		</View>
	}
	return (
		<KentKartAuthValidator
			else={
				<SafeAreaView>
					<StatusBar style="auto" />
					<Animated.View style={{ transform: [{ translateX: translateX }], width: page_width * 2 }} className={"flex-row h-full"}>
						<AuthPanel updatePage={updatePage} navigation={navigation} panel_type={0} />
						<AuthPanel updatePage={updatePage} navigation={navigation} panel_type={1} />
					</Animated.View>
				</SafeAreaView>
			}
		>
			<SafeAreaView className="items-center justify-center flex-1">
				<MaterialCommunityIcons name="help" size={48*4} style={{opacity:0.3,marginBottom:2*4}}/>
				<SecondaryText>Nothing to see here!</SecondaryText>
				<TouchableOpacity
					activeOpacity={0.5}
					style={{
						borderRadius: 16,
						paddingHorizontal: 32,
						paddingVertical: 12,
						marginTop:12*4,
						backgroundColor: Application.styles.primary,
					}}
					onPress={() => {
						const navigation = props.navigation
						if (navigation) {
							navigation.replace("home")
						} else {
							alert("navigation is null")
						}
					}}
				>
					<SecondaryText style={{color:Application.styles.white,fontSize:32}}>
						Go home
					</SecondaryText>
				</TouchableOpacity>
			</SafeAreaView>
		</KentKartAuthValidator>
	)
}
