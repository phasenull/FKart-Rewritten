import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native"
import Application from "../common/Application"
import { StatusBar } from "expo-status-bar"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useEffect, useState } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import AuthPanel from "../components/AuthPanel"
import User from "../common/classes/User"

export default function AuthPage(props: { navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	const theme = Application.theme
	const page_width = useWindowDimensions().width
	const translateX = useSharedValue(0)
	const styles = Application.styles
	function updatePage(index:number) {
		translateX.value = withTiming(page_width * (1-index) - page_width, { duration: 250 })
	}
	useEffect(() => {
		updatePage(0)
	}, [])
	function logged_in(user:User) {
		console.log("logged in with user", user.toJSON())
		navigation.navigate("home",{user:user})
	}
	return (
		<SafeAreaView>
			<StatusBar style="auto" />
			<Animated.View style={{ transform: [{ translateX: translateX }], width: page_width * 2 }} className={"flex-row h-full"}>
				<AuthPanel callBack={logged_in} updatePage={updatePage} panel_type={0} />
				<AuthPanel callBack={logged_in} updatePage={updatePage} panel_type={1} />
			</Animated.View>
		</SafeAreaView>
	)
}
