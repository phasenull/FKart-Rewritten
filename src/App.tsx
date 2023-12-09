import { LogBox, StatusBar, Text, View, useColorScheme } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import HomePage from "./pages/Home"
import Application from "./util/Application"
import AuthPage from "./pages/Auth"

const Stack = createNativeStackNavigator()
export default function App() {
	const colorScheme = useColorScheme()
	LogBox.ignoreLogs(["Require cycle:"])
	Application.__INIT()
	return (
		<NavigationContainer>
			
			<Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
				<Stack.Screen name="home" component={HomePage} />
				<Stack.Screen name="auth" component={AuthPage} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}
