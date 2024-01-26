import { LogBox, Text, View, useColorScheme } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import HomePage from "./src/screens/Home"
import AuthPage from "./src/screens/Auth"
import CardDetails from "./src/screens/CardDetails"
import { QueryClient, QueryClientProvider } from "react-query"
LogBox.ignoreLogs(["Non-serializable values were found in the navigation state."])
const Stack = createNativeStackNavigator()
import Application from "./src/common/Application"
import RouteDetails from "./src/screens/RouteDetails"
import BusDetails from "./src/screens/BusDetails"
import MapData from "./src/screens/MapData"
import { GestureHandlerRootView } from "react-native-gesture-handler"
const queryClient = new QueryClient()
export default function AppEntryComponent() {
	LogBox.ignoreLogs(["Non-serializable values were found in the navigation state."])
	const colorScheme = useColorScheme()
	console.log(colorScheme)
	LogBox.ignoreLogs(["Require cycle:", "Clipboard has been extracted from react-native"])

	Application.__INIT()
	return (
		<QueryClientProvider client={queryClient}>
			<NavigationContainer>
				<GestureHandlerRootView style={{flex:1}}>
					<Stack.Navigator
						initialRouteName="Home"
						screenOptions={{
							headerShown: false,
							statusBarHidden: false,
						}}
					>
						<Stack.Screen name="home" component={HomePage} />
						<Stack.Screen name="auth" component={AuthPage} />
						<Stack.Screen
							name="card_details"
							headerTitle=""
							options={{
								headerShown: true,
								headerTitle: "",
								headerTransparent: true,
								headerTitleAlign: "center",
								headerTitleStyle: { color: "white" },
								headerTintColor: "white",
							}}
							component={CardDetails}
						/>
						<Stack.Screen
							name="route_details"
							headerTitle=""
							options={{
								headerShown: true,
							}}
							component={RouteDetails}
						/>
						<Stack.Screen
							name="bus_details"
							options={{
								headerShown: true,
							}}
							headerTitle=""
							component={BusDetails}
						/>
						<Stack.Screen
							name="map_data"
							options={{
								headerShown: true,
							}}
							headerTitle=""
							component={MapData}
						/>
					</Stack.Navigator>
				</GestureHandlerRootView>
			</NavigationContainer>
		</QueryClientProvider>
	)
}
