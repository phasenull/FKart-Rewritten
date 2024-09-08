import { BottomTabNavigator } from "components/reusables/BottomTabNavigator"
import { StatusBar } from "expo-status-bar"
import React from "react"
import { View } from "react-native"
export default function RootScreen() {
	return (
		<View className="flex-1">
			<StatusBar translucent={false} style="dark" />
			<BottomTabNavigator/>
		</View>
	)
}
