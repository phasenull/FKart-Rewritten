import { useFKartAuthStore } from "common/stores/FKartAuthStore";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { router, Stack, usePathname } from 'expo-router';
import { openDatabaseSync } from "expo-sqlite/next";
import { useEffect } from "react";
import { LogBox, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "react-query";
import migrations from '../../drizzle/migrations';
import { ThemeProvider } from "../common/contexts/ThemeContext";
import { TranslationsProvider } from "../common/contexts/TranslationsContext";
import SecondaryText from "components/reusables/SecondaryText";
import Logger from "common/Logger";

const sqlite = openDatabaseSync("fkart_sqlite.db")
export const drizzleDB = drizzle(sqlite)

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } })
export default function AppEntryComponent() {
	// Logger.success("App.tsx", "\n\n\n-=-=-=-=-=-=-=-=-=-=-=-=-\n\n   START OF NEW RENDER")
	const fetchAccessToken = useFKartAuthStore((state) => state.fetchAccessToken)
	useEffect(() => {
		fetchAccessToken()
		const secondsTimer = setInterval(() => {
			fetchAccessToken()
		}, 3 * 60 * 1000)
		return () => clearInterval(secondsTimer)
	}, [fetchAccessToken])
	LogBox.ignoreLogs(["Non-serializable values were found in the navigation state."])
	LogBox.ignoreLogs(["Require cycle:", "Clipboard has been extracted from react-native"])

	const { success, error } = useMigrations(drizzleDB, migrations)
	if (error) {
		Logger.error("App.tsx",error.message)
		return (
			<View className="flex-1">
				<Text className="bg-cyan-400 text-center self-center text-red-400">Migration error: {error.message}</Text>
			</View>
		)
	}
	if (!success) {
		return (
			<View>
				<Text>Migration is in progress...</Text>
			</View>
		)
	}

	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<ThemeProvider>
					<TranslationsProvider>
						<Stack>
							<Stack.Screen options={{
								headerShown:true
							}}>
							</Stack.Screen>
						</Stack>
					</TranslationsProvider>
				</ThemeProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	)
}
