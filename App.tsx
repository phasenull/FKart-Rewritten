import { LogBox, Text, View, useColorScheme } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import HomePage from "./src/screens/Home"
import AuthPage from "./src/screens/Auth"
import CardDetails from "./src/screens/CardDetails"
import { QueryClient, QueryClientProvider } from "react-query"
const Stack = createNativeStackNavigator()
import Application from "./src/common/Application"
import RouteDetails from "./src/screens/RouteDetails"
import BusDetails from "./src/screens/BusDetails"
import MapData from "./src/screens/MapData"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as Linking from "expo-linking"
const config = {
	screens: {
		route_details: "route_details/:fetch_from_id/:direction?/:bus_id?",
	},
}
const linking = {
	prefixes: [Linking.createURL("/"), "https://deep.fkart.project.phasenull.dev"],
	config: config,
}
const queryClient = new QueryClient()
export default function AppEntryComponent() {
	LogBox.ignoreLogs(["Non-serializable values were found in the navigation state."])
	LogBox.ignoreLogs(["Require cycle:", "Clipboard has been extracted from react-native"])
	const colorScheme = useColorScheme()
	console.log(colorScheme)
	Application.__INIT()
	return (
		<QueryClientProvider client={queryClient}>
			<NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
				<GestureHandlerRootView style={{ flex: 1 }}>
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
