import { LogBox, Text, View, useColorScheme } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
LogBox.ignoreLogs(["Non-serializable values were found in the navigation state."])
const Stack = createNativeStackNavigator()
let Application
export default function AppEntryComponent() {
	LogBox.ignoreLogs(["Non-serializable values were found in the navigation state."])
	const colorScheme = useColorScheme()
	console.log(colorScheme)
	LogBox.ignoreLogs(["Require cycle:"])
	Application = require("./util/Application").default
	Application.__INIT()
	const HomePage = require("./pages/Home").default
	const AuthPage = require("./pages/Auth").default
	const CardDetails = require("./pages/CardDetails").default
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
