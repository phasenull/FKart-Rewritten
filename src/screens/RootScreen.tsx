import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { useContext, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Button, Keyboard, Modal, Pressable, SafeAreaView, Text, TouchableHighlight, TouchableOpacity, View, useWindowDimensions } from "react-native"
import Application from "../common/Application"
import NotLoggedInModal from "../components/auth/NotLoggedInModal"
import User from "../common/classes/User"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import HomeTab from "../tabs/home/HomeTab"
import AccountTab from "../tabs/home/AccountTab"
import SearchTab from "../tabs/home/SearchTab"
import CustomLoadingIndicator from "../components/CustomLoadingIndicator"
import { TabIconWrapper } from "../components/root/TabIconWrapper"
import WelcomerPage from "./Welcomer"
import EditorTab from "../tabs/home/EditorTab"
import { UserContext } from "../common/contexts/UserContext"
export default function RootScreen(props: { navigation: NativeStackNavigationProp<any>; route: { params?: { user?: User | undefined } } }) {
	const { route } = props
	const { error, isError, isFetching, loggedUser: user } = useContext(UserContext)
	const { navigation } = props
	const [prompt_log_in, set_prompt_log_in] = useState(false)
	const Tab = useMemo(() => {
		return createBottomTabNavigator()
	}, [])
	const styles = Application.styles
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
			<Tab.Navigator
				backBehavior="initialRoute"
				initialRouteName="Settings"
				screenOptions={{
					tabBarItemStyle: {
						borderRadius: 100,
						margin: 10,
					},
					tabBarLabelStyle: {
						fontSize: 14,
						fontWeight: "bold",
					},
					tabBarActiveBackgroundColor: styles.primary,
					tabBarActiveTintColor: styles.white,
					tabBarInactiveBackgroundColor: styles.white,
					tabBarInactiveTintColor: styles.secondaryDark,

					tabBarLabelPosition: "below-icon",
					headerShown: false,
					tabBarStyle: {
						height: 65,
						position: "absolute",
						marginBottom: 10,
						marginHorizontal: 20,
						borderRadius: 100,
					},
					tabBarHideOnKeyboard: true,
				}}
			>
				<Tab.Screen
					name="Editor"
					initialParams={{ user: user }}
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							// <TabIconWrapper>
							<MaterialCommunityIcons
								name="pencil"
								size={size}
								style={{
									bottom: (focused && 7) || 0,
									backgroundColor: (focused && styles.primary) || styles.white,
									borderRadius: 100,
									paddingHorizontal: 6,
								}}
								color={color}
							/>
							// {/* </TabIconWrapper> */}
						),
					}}
					component={EditorTab}
				/>
				<Tab.Screen
					name="Search"
					initialParams={{ user: user }}
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							// <TabIconWrapper>
							<MaterialCommunityIcons
								name="magnify"
								size={size}
								style={{
									bottom: (focused && 7) || 0,
									backgroundColor: (focused && styles.primary) || styles.white,
									borderRadius: 100,
									paddingHorizontal: 6,
								}}
								color={color}
							/>
							// {/* </TabIconWrapper> */}
						),
					}}
					component={SearchTab}
				/>
				<Tab.Screen
					name="Home"
					initialParams={{ user: user }}
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							// <TabIconWrapper>
							<MaterialCommunityIcons
								name="home"
								size={size}
								style={{
									bottom: (focused && 7) || 0,
									backgroundColor: (focused && styles.primary) || styles.white,
									borderRadius: 100,
									paddingHorizontal: 6,
								}}
								color={color}
							/>
							// {/* </TabIconWrapper> */}
						),
					}}
					component={HomeTab}
				/>
				<Tab.Screen
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							// <TabIconWrapper>
							<MaterialCommunityIcons
								name="cog"
								size={size}
								style={{
									bottom: (focused && 7) || 0,
									backgroundColor: (focused && styles.primary) || styles.white,
									borderRadius: 100,
									paddingHorizontal: 6,
								}}
								color={color}
							/>
							// </TabIconWrapper>
						),
					}}
					name="Settings"
					initialParams={{ user: user }}
					component={AccountTab}
				/>
			</Tab.Navigator>
		</View>
	)
}
