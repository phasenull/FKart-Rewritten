import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Button, Modal, Pressable, SafeAreaView, Text, TouchableHighlight, TouchableOpacity, View, useWindowDimensions } from "react-native"
import Application from "../util/Application"
import NotLoggedInModal from "../components/NotLoggedInModal"
import User from "../util/classes/User"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"


import MainTab from "../tabs/home/MainTab"
import AccountTab from "../tabs/home/AccountTab"
export default function HomePage(props: { navigation: NativeStackNavigationProp<any>, route:{params?:{user?:User|undefined}} }) {
	const [user, setUser] = useState<User | undefined>(props.route.params?.user)
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
	return (
		<View className="flex-1">
			<StatusBar translucent={false} style="dark" />
			{user ? (
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
						tabBarActiveTintColor: styles.dark,
						tabBarInactiveBackgroundColor: styles.white,
						tabBarInactiveTintColor: styles.secondaryDark,
						tabBarLabelPosition: "below-icon",
						headerShown: false,
						tabBarStyle: {
							height: 60,
							position: "absolute",
							marginBottom: 10,
							marginHorizontal: 20,
							borderRadius: 100,
						},
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
									style={{ bottom: (focused && 7) || 0, backgroundColor: (focused && styles.primary) || styles.white, borderRadius: 100, paddingTop: 1, paddingHorizontal: 6 }}
									color={color}
								/>
							),
						}}
						component={MainTab}
					/>
					<Tab.Screen
						name="Home"
						initialParams={{ user: user }}
						options={{
							tabBarIcon: ({ focused, color, size }) => (
								<MaterialCommunityIcons
									name="home"
									size={size}
									style={{ bottom: (focused && 7) || 0, backgroundColor: (focused && styles.primary) || styles.white, borderRadius: 100, paddingTop: 1, paddingHorizontal: 6 }}
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
									style={{ bottom: (focused && 7) || 0, backgroundColor: (focused && styles.primary) || styles.white, borderRadius: 100, paddingTop: 1, paddingHorizontal: 6 }}
									color={color}
								/>
							),
						}}
						name="Account"
						initialParams={{ user: user }}
						component={AccountTab}
					/>
				</Tab.Navigator>
			) : prompt_log_in ? (
				<NotLoggedInModal navigation={navigation} onRequestClose={() => {}} param_visible={true} />
			) : (
				<ActivityIndicator className="mx-auto my-auto scale-150" size="large" color={styles.primary} />
			)}
		</View>
	)
}
