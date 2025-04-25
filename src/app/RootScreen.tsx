import { BottomTabNavigator } from "components/reusables/BottomTabNavigator"
import CityValidator from "components/validators/CityValidator"
import { StatusBar } from "expo-status-bar"
import React from "react"
import { View } from "react-native"
export default function RootScreen() {
	return (
		<CityValidator redirect={true}>
			<View className="flex-1">
				<StatusBar translucent={false} style="dark" />
				<BottomTabNavigator />
			</View>
		</CityValidator>
	)
}
