import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { Text, View } from "react-native"
import ApplicationConfig from "common/ApplicationConfig"
import { BottomTabNavigator } from "components/root/BottomTabNavigator"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
export default function RootScreen(props: { navigation: NativeStackNavigationProp<any>}) {
	
	const { user } = useKentKartAuthStore((state)=>state)
	useEffect(() => {
		async function get() {
			if (!ApplicationConfig.__is_init) {
				setTimeout(() => {
					get()
				}, 100)
				return
			}
		}
		get()
	}, [])
	// TODO separate these into different files

	return (
		<View className="flex-1">
			<StatusBar translucent={false} style="dark" />
			<BottomTabNavigator navigation={props.navigation}/>
		</View>
	)
}
