import { useFKartAuthStore } from "common/stores/FKartAuthStore"
import { Redirect, router, Stack, usePathname } from "expo-router"
import { openDatabaseSync } from "expo-sqlite/next"
import { useEffect } from "react"
import { LogBox, Text, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { QueryClient, QueryClientProvider } from "react-query"
import { ThemeProvider } from "../common/contexts/ThemeContext"
import { TranslationsProvider } from "../common/contexts/TranslationsContext"
import SecondaryText from "components/reusables/SecondaryText"
import Logger from "common/Logger"
import * as Notifications from "expo-notifications"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import ErrorPage from "./ErrorPage"
const sqlite = openDatabaseSync("fkart_sqlite.db")
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
		priority: Notifications.AndroidNotificationPriority.HIGH,
	}),
})
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 2 } } })
export default function AppEntryComponent() {
	// Logger.success("App.tsx", "\n\n\n-=-=-=-=-=-=-=-=-=-=-=-=-\n\n   START OF NEW RENDER")
	const fetchAccessToken = useFKartAuthStore((state) => state.fetchAccessToken)
	const fetchKKAccessToken = useKentKartAuthStore((state) => state.fetchAccessToken)
	const region = useKentKartAuthStore((state) => state.region)
	useEffect(() => {

		fetchAccessToken().then(([token, error]) => console.log("fetched F token", token, error))
		fetchKKAccessToken().then(([token, error]) => console.log("fetched KK token", token, error))
		const secondsTimer = setInterval(() => {
			fetchAccessToken()
		}, 3 * 60 * 1000)
		return () => clearInterval(secondsTimer)
	}, [fetchAccessToken])
	LogBox.ignoreLogs(["Non-serializable values were found in the navigation state."])
	LogBox.ignoreLogs(["Require cycle:", "Clipboard has been extracted from react-native"])

	
	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<ThemeProvider>
					<TranslationsProvider>
						<Stack screenOptions={{ headerShown: false }}></Stack>
					</TranslationsProvider>
				</ThemeProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	)
}
