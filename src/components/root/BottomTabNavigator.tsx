import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useContext, useMemo, useState } from "react"
import Application from "../../common/Application"
import { TranslationsContext } from "../../common/contexts/TranslationsContext"
import { UserContext } from "../../common/contexts/UserContext"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AccountTab from "../../tabs/AccountTab"
import EditorTab from "../../tabs/EditorTab"
import HomeTab from "../../tabs/HomeTab"
import SearchTab from "../../tabs/SearchTab"
import { Text, TouchableOpacity, View } from "react-native"
import SecondaryText from "./SecondaryText"
import { ThemeContext } from "../../common/contexts/ThemeContext"

function BottomTabButton(props: { state: any; descriptors: any; navigation: NativeStackNavigationProp<any>; route: any; index: number }) {
	const { descriptors, navigation, state, index, route } = props
	const { options } = descriptors
	const label = options.tabBarLabel || options.title || route.name
	const isFocused = state.index === index
	const onPress = () => {
		if (!isFocused) {
			navigation.navigate(route.name, route.params)
		}
	}
	const {theme} = useContext(ThemeContext)
	const primaryColor = isFocused ? theme.white : theme.secondary
	const backgroundColor = isFocused ? theme.primary : theme.white
	return (
		<TouchableOpacity
			disabled={isFocused}
			key={route.key}
			onPress={onPress}
			style={{
				flex: 1,
				backgroundColor: backgroundColor,
				borderRadius: 32,
				marginHorizontal: 1 * 4,
				marginVertical: 2 * 4,
				bottom: isFocused ? 1*4 : 0,
			}}
			className="items-center"
		>
			<View
				className="h-12 w-12 rounded-full items-center"
				style={{
					bottom: isFocused ? 2 * 4 : 0,
					backgroundColor: backgroundColor,
				}}
			>
				{options.tabBarIcon({ focused: isFocused, color: primaryColor, size: 32 })}
			</View>
			<SecondaryText style={{ color: primaryColor, fontSize: 16, position: "absolute", bottom:isFocused?0:-6 }} numberOfLines={1}>
				{label}
			</SecondaryText>
		</TouchableOpacity>
	)
}
function BottomTab(props: { state: any; descriptors: any; navigation: any }) {
	const { descriptors, navigation, state } = props
	const {theme} = useContext(ThemeContext)
	return (
		<View className="flex-row mx-2 px-1 pb-1 mb-2 absolute bottom-0" style={{ borderRadius: 100, backgroundColor: theme.white, elevation: 4 }}>
			{state.routes.map((route: any, index: number) => {
				return <BottomTabButton key={route.key} descriptors={descriptors[route.key]} index={index} navigation={navigation} route={route} state={state} />
			})}
		</View>
	)
}
export function BottomTabNavigator(props: { navigation: NativeStackNavigationProp<any> }) {
	const { translations } = useContext(TranslationsContext)
	const Tab = useMemo(() => {
		return createBottomTabNavigator()
	}, [])
	return (
		<Tab.Navigator
			backBehavior="initialRoute"
			initialRouteName={translations.tabs.settings.name}
			tabBar={BottomTab}
			screenOptions={{
				headerShown: false,
			}}
		>
			{true ? (
				<Tab.Screen
					name={translations.tabs.editor.name}
					options={{
						tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons name="pencil" size={size} color={color} />,
					}}
					component={EditorTab}
				/>
			) : null}
			<Tab.Screen
				name={translations.tabs.search.name}
				options={{
					tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons name="magnify" size={size} color={color} />,
				}}
				component={SearchTab}
			/>

			<Tab.Screen
				name={translations.tabs.home.name}
				options={{
					tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons name="home" size={size} color={color} />,
				}}
				component={HomeTab}
			/>
			<Tab.Screen
				options={{
					tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons name="cog" size={size} color={color} />,
				}}
				name={translations.tabs.settings.name}
				component={AccountTab}
			/>
		</Tab.Navigator>
	)
}
