import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Button, Keyboard, Modal, Pressable,  Text, TouchableHighlight, TouchableOpacity, View, useWindowDimensions } from "react-native"
import Application from "../common/Application"
import NotLoggedInModal from "../components/screen_components/auth/NotLoggedInModal"
import User from "../common/classes/User"
import { BottomTabNavigator } from "../components/root/BottomTabNavigator"
import { UserContext } from "../common/contexts/UserContext"
export default function RootScreen(props: { navigation: NativeStackNavigationProp<any>; route: { params?: { user?: User | undefined } } }) {
	
	const { error, isError, isFetching, loggedUser: user } = useContext(UserContext)
	useEffect(() => {
		async function get() {
			if (!Application.__is_init) {
				setTimeout(() => {
					get()
				}, 100)
				return
			}
		}
		get()
	}, [])
	if (isFetching) {
		return (
			<View>
				<Text>fetching</Text>
			</View>
		)
	}
	// TODO separate these into different files

	return (
		<View className="flex-1">
			<StatusBar translucent={false} style="dark" />
			<BottomTabNavigator navigation={props.navigation}/>
		</View>
	)
}
