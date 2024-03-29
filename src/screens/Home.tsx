import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { useEffect, useMemo, useState } from "react"
import {
	ActivityIndicator,
	Button,
	Keyboard,
	Modal,
	Pressable,
	SafeAreaView,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from "react-native"
import Application from "../common/Application"
import NotLoggedInModal from "../components/auth/NotLoggedInModal"
import User from "../common/classes/User"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MainTab from "../tabs/home/MainTab"
import AccountTab from "../tabs/home/AccountTab"
import Routes from "../tabs/home/Routes"
import CustomLoadingIndicator from "../components/CustomLoadingIndicator"
export default function HomePage(props: {
	navigation: NativeStackNavigationProp<any>
	route: { params?: { user?: User | undefined } }
}) {
	const { route } = props
	const [user, setUser] = useState<User | undefined>(
		props.route.params?.user
	)
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
			const user_data = Application.logged_user
			console.log("user_data is valid")
			if (user_data) {
				setUser(user_data)
			} else {
				console.log("user not logged in")
				set_prompt_log_in(true)
			}
		}
		get()
	}, [])

	// TODO separate these into different files
	if (user) {
		return (
			<View className="flex-1">
				<StatusBar translucent={false} style="dark" />
				<Tab.Navigator
					initialRouteName="Account"
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
						name="Routes"
						initialParams={{ user: user }}
						options={{
							tabBarIcon: ({ focused, color, size }) => (
								<MaterialCommunityIcons
									name="bus"
									size={size}
									style={{
										bottom: (focused && 7) || 0,
										backgroundColor:
											(focused && styles.primary) || styles.white,
										borderRadius: 100,
										paddingHorizontal: 6,
									}}
									color={color}
								/>
							),
						}}
						component={Routes}
					/>
					<Tab.Screen
						name="Home"
						initialParams={{ user: user }}
						options={{
							tabBarIcon: ({ focused, color, size }) => (
								<MaterialCommunityIcons
									name="home"
									size={size}
									style={{
										bottom: (focused && 7) || 0,
										backgroundColor:
											(focused && styles.primary) || styles.white,
										borderRadius: 100,
										paddingHorizontal: 6,
									}}
									color={color}
								/>
							),
						}}
						component={MainTab}
					/>
					<Tab.Screen
						options={{
							tabBarIcon: ({ focused, color, size }) => (
								<MaterialCommunityIcons
									name="account"
									size={size}
									style={{
										bottom: (focused && 7) || 0,
										backgroundColor:
											(focused && styles.primary) || styles.white,
										borderRadius: 100,
										paddingHorizontal: 6,
									}}
									color={color}
								/>
							),
						}}
						name="Account"
						initialParams={{ user: user }}
						component={AccountTab}
					/>
				</Tab.Navigator>
			</View>
		)
	}
	if (prompt_log_in) {
		return (
			<NotLoggedInModal
				navigation={navigation}
				onRequestClose={() => {}}
				param_visible={true}
			/>
		)
	}
	return (<CustomLoadingIndicator />)
}
