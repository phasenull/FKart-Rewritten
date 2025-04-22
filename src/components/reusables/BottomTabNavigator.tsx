import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import { useContext, useMemo } from "react"

import CitySelector from "app/(core)/city_selector"
import { ITheme, ThemeContext } from "common/contexts/ThemeContext"
import CityValidator from "components/validators/CityValidator"
import { Tabs, useNavigation } from "expo-router"
import { TouchableOpacity, View } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AccountTab from "tabs/AccountTab/AccountTab"
import EditorTab from "tabs/EditorTab"
import HomeTab from "tabs/home/HomeTab"
import SearchTab from "tabs/SearchTab"
import SecondaryText from "./SecondaryText"

function BottomTabButton(props: { state: any; descriptors: any; route: any; index: number }) {
	const { descriptors, state, index, route } = props
	const { options } = descriptors
	const label = options.tabBarLabel || options.title || route.name
	const isFocused = state.index === index
	const navigation = useNavigation()
	const onPress = () => {
		if (!isFocused) {
			///@ts-ignore
			navigation.navigate(route.name as any, route.params as any)
		}
	}
	const { theme } = useContext(ThemeContext)
	const primaryColor = isFocused ? theme.primary : theme.text.white
	const backgroundColor = isFocused ? theme.text.white : "transparent"
	return (
		<TouchableOpacity
			disabled={isFocused}
			key={route.key}
			onPress={onPress}
			style={{
				backgroundColor: "transparent",
				flex: isFocused ? 1.5 : 1,
				// marginHorizontal: 1 * 4,
				marginVertical: 2 * 4,
			}}
		>
			<View
				className="flex-row self-center py-2 items-center px-2 space-x-1"
				style={{
					// justifyContent: isFocused ? "space-between" : "center",
					backgroundColor: backgroundColor,
					borderRadius: 32,
					// width: "max",
				}}
			>
				<View
					className="rounded-full justify-center items-center"
					style={
						{
							// backgroundColor: backgroundColor,
						}
					}
				>
					{options.tabBarIcon({ focused: isFocused, color: primaryColor, size: isFocused ? 24 : 32 })}
				</View>
				{isFocused ? (
					<SecondaryText
						style={{ color: theme.text.secondary, fontSize: 16, fontWeight: "800" }}
						numberOfLines={1}
					// className="bg-red-400"
					>
						{label}
					</SecondaryText>
				) : null}
			</View>
		</TouchableOpacity>
	)
}
function BottomTab(props: BottomTabBarProps) {
	const { descriptors, state, insets } = props as BottomTabBarProps
	const theme = Object.values(descriptors)[0].options.tabBarStyle as ITheme
	return (
		<View
			className="flex-row mx-2 items-center self-center max-w-80 w-[90%] mb-4 absolute bottom-0"
			style={{
				borderRadius: 100,
				elevation: 4,
				height: 18 * 4,
				backgroundColor: theme?.secondaryDark,
			}}
		>
			{state.routes.map((route: any, index: number) => {
				return <BottomTabButton key={route.key} descriptors={descriptors[route.key]} index={index} route={route} state={state} />
			})}
		</View>
	)
}

export function BottomTabNavigator() {
	const { translations } = useContext(TranslationsContext)
	const { theme } = useContext(ThemeContext)

	return (
		<Tabs
			backBehavior="initialRoute"
			// initialRouteName={translations.tabs.settings.name}
			tabBar={BottomTab}
			screenOptions={{
				tabBarStyle: theme as any,
				headerShown: false,
			}}
		>
			{true ? (
				<Tabs.Screen
				
					name={translations.tabs.editor.name}
					options={{
						tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons name="pencil" size={size} color={color} />,
					}}

				/>
			) : null}
			<Tabs.Screen
				name={translations.tabs.search.name}
				options={{
					tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons name="magnify" size={size} color={color} />,
				}}
			/>

			<Tabs.Screen
				name={translations.tabs.home.name}
				options={{
					tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons name="home" size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				options={{
					tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons name="cog" size={size} color={color} />,
				}}
				name={translations.tabs.settings.name}
			/>
		</Tabs>
	)
}
function WrappedSearch() {
	return (
		<CityValidator else={<CitySelector />}>
			<SearchTab />
		</CityValidator>
	)
}
