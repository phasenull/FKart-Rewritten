import { LogBox, View, useColorScheme } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import HomePage from "./pages/Home"
import Application from "./util/Application"
import AuthPage from "./pages/Auth"
import CardDetails from "./pages/CardDetails"
LogBox.ignoreLogs(["Non-serializable values were found in the navigation state."])
const Stack = createNativeStackNavigator()
export default function App() {
	LogBox.ignoreLogs(["Non-serializable values were found in the navigation state."])
	const colorScheme = useColorScheme()
	console.log(colorScheme)
	LogBox.ignoreLogs(["Require cycle:"])
	Application.__INIT()
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, statusBarHidden: false }}>
				<Stack.Screen name="home" component={HomePage} />
				<Stack.Screen name="auth" component={AuthPage} />
				<Stack.Screen
					name="card_details"
					options={{ headerShown: true, headerTransparent: true, headerTitleAlign: "center", headerTitleStyle: { color: "white" }, headerTintColor: "white" }}
					component={CardDetails}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}
