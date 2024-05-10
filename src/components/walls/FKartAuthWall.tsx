import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native"
import Application from "../../common/Application"
import { StatusBar } from "expo-status-bar"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useContext, useEffect, useState } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import User from "../../common/classes/User"

import KentKartAuthValidator from "../validators/KentKartAuthValidator"
import SecondaryText from "../root/SecondaryText"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { UserContext } from "../../common/contexts/UserContext"
import AuthPanel from "../screen_components/auth/AuthPanel"
import { FKartContext } from "../../common/contexts/FKartContext"
import FKartAuthValidator from "../validators/FKartAuthValidator"
import NothingToSeeHere from "./NothingToSeeHere"
import FKartAuthTypeSelector from "../../screens/FKart/auth/AuthTypeSelector"

export default function FKartAuthWall(props: { navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	const theme = Application.theme
	const page_width = useWindowDimensions().width
	const translateX = useSharedValue(0)
	const styles = Application.styles
	const {fkartUser} = useContext(FKartContext)
	if (fkartUser) {
		navigation.replace("home")
		return <View>
			
		</View>
	}
	return (
		<FKartAuthValidator
			else={<FKartAuthTypeSelector navigation={navigation}/>
			}
		>
			<NothingToSeeHere navigation={navigation}/>
		</FKartAuthValidator>
	)
}
