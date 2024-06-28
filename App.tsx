import { LogBox, Text, useColorScheme } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import RootScreen from "screens/RootScreen"
import AuthPage from "screens/auth/Auth"
import CardDetails from "screens/card_details/CardDetails"
import { QueryClient, QueryClientProvider } from "react-query"
const Stack = createNativeStackNavigator()
import ApplicationConfig from "./src/common/ApplicationConfig"
import RouteDetails from "screens/route_details/RouteDetails"
import BusDetails from "screens/BusDetails"
import MapData from "screens/map_details/map_details"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as Linking from "expo-linking"
import WelcomerPage from "screens/Welcomer"
import { TranslationsProvider } from "./src/common/contexts/TranslationsContext"
import { FKartContextProvider } from "./src/common/contexts/FKartContext"
import FKartAuthPage from "./src/components/walls/FKartAuthWall"
import FKartWelcomer from "screens/fkart/auth/push/Welcomer"
import { ThemeProvider } from "./src/common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import CitySelector from "screens/city_selector/CitySelector"

const config = {
	screens: {
		route_details: "route_details/:fetch_from_id/:direction?/:bus_id?",
	},
}
const linking = {
	prefixes: [Linking.createURL("/"), "https://deep.fkart.project.phasenull.dev"],
	config: config,
}

const queryClient = new QueryClient({defaultOptions:{queries:{retry:1}}})
export default function AppEntryComponent() {
	LogBox.ignoreLogs(["Non-serializable values were found in the navigation state."])
	LogBox.ignoreLogs(["Require cycle:", "Clipboard has been extracted from react-native"])
	const initF = useKentKartAuthStore((state)=>state.__initF)
	initF()
	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<FKartContextProvider>
					<ThemeProvider>
						<TranslationsProvider>
							<NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
								<Stack.Navigator
									initialRouteName="welcomer"
									screenOptions={{
										headerShown: false,
										statusBarHidden: false,
									}}
								>
									<Stack.Screen name="welcomer" component={WelcomerPage as any} />
									<Stack.Screen name="fkart.auth" component={FKartAuthPage} />
									<Stack.Screen name="fkart.auth.welcomer" component={FKartWelcomer} />
									<Stack.Screen name="fkart.auth.signin" component={FKartWelcomer} />
									<Stack.Screen name="fkart.auth.signup" component={FKartWelcomer} />
									<Stack.Screen name="home" component={RootScreen} />
									<Stack.Screen name="auth" component={AuthPage} />
									<Stack.Screen
										name="card_details"
										options={{
											headerShown: true,
											headerTitle: "",
											headerTransparent: true,
											headerTitleAlign: "center",
											headerTitleStyle: { color: "white" },
											headerTintColor: "white",
										}}
										component={CardDetails as any}
									/>
									<Stack.Screen
										name="route_details"
										options={{
											headerShown: true,
											title: "",
										}}
										component={RouteDetails as any}
									/>
									<Stack.Screen
										name="bus_details"
										options={{
											headerShown: true,
											title: "",
										}}
										component={BusDetails as any}
									/>
									<Stack.Screen
										name="map_data"
										options={{
											headerShown: true,
											title: "",
										}}
										component={MapData as any}
									/>
									<Stack.Screen
										name="city_selector"
										options={{
											headerShown: false,
											// title: "Select City",
										}}
										component={CitySelector as any}
									/>
								</Stack.Navigator>
							</NavigationContainer>
						</TranslationsProvider>
					</ThemeProvider>
				</FKartContextProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	)
}
