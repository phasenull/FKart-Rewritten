import { MaterialCommunityIcons } from "@expo/vector-icons";
import { drizzleDB } from "app/_layout";
import ErrorPage from "app/ErrorPage";
import ApplicationConfig from "common/ApplicationConfig";
import { ThemeContext } from "common/contexts/ThemeContext";
import Logger from "common/Logger";
import { app_cache } from "common/schema";
import { deltaTime } from "common/util";
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator";
import SecondaryText from "components/reusables/SecondaryText";
import SimplyButton from "components/ui/SimplyButton";
import SimplyTextInput from "components/ui/SimplyTextInput";
import { eq, isNotNull } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-vector-icons/Icon";
import { useMutation, useQuery } from "react-query";

export default function AppData() {
	const { theme } = useContext(ThemeContext)
	const { data, refetch, isRefetching, isLoading } = useQuery(["db_query_app_cache"], () => (drizzleDB.select().from(app_cache).all()))
	const { fill_key } = useLocalSearchParams()
	// a very poor way to handle forms
	const [form, setForm] = useState<{ key: string, value: string }>({ key: fill_key as string, value: "true" })
	const { mutate } = useMutation({
		mutationKey: "force-set-db", mutationFn: async (props: { key: string, value: any }) => {
			const { key, value } = props
			await ApplicationConfig.database.set(key, value)
		}
	})
	if (isRefetching || isLoading) {
		return <CustomLoadingIndicator />
	}
	if (!data) return <ErrorPage error={{ title: "NO DATA" }} />
	return (
		<ScrollView contentContainerStyle={{alignItems:"center"}} className="flex-1">
			<Stack.Screen options={{ headerShown: true }} />
			<View className="py-5 mt-5 px-10 w-80 rounded-[16px] justify-center" style={{ backgroundColor: theme.white, shadowOffset: { height: 4, width: 4 } }}>
				<SecondaryText>Total Items Cached: {data.length}</SecondaryText>
				<SimplyButton type="secondary" color={theme.error} size="medium" text="clean" onPress={async () => {
					const results = await drizzleDB.delete(app_cache).where(isNotNull(app_cache.key)).returning()
					console.log(results)
					refetch()
				}}>
				</SimplyButton>
				<SimplyButton type="secondary" color={theme.secondary} size="medium" text="add 20" onPress={async () => {
					for (let index = 0; index < 20; index++) {
						const [returned] = await drizzleDB.insert(app_cache).values({
							key: `key-${Math.floor(Math.random() * 1000)}`,
							value: {
								nested_value: Math.random()
							},
							ttl: 100
						}).returning()
						console.log(returned)
					}
					refetch()
				}}>
				</SimplyButton>
			</View>
			<View className="py-5 mt-5 px-10 w-80 rounded-[16px] justify-center" style={{ backgroundColor: theme.white, shadowOffset: { height: 4, width: 4 } }}>
				<SecondaryText>Force Set AppDB</SecondaryText>
				<SimplyTextInput defaultValue={form.key} placeholder="key" onChangeText={(text) => setForm({ ...form, key: text })}>

				</SimplyTextInput>
				<SimplyTextInput defaultValue={form.value} placeholder="(JSON)" onChangeText={(text) => setForm({ ...form, value: text })}>

				</SimplyTextInput>
				<SimplyButton type="secondary" color={theme.success} size="medium" text="set" onPress={async () => {
					await ApplicationConfig.database.set(form.key, form.value || {})
					Logger.log("AppData.tsx", "Set key", form.key, "to value", form.value)
				}}>
				</SimplyButton>
			</View>
			{data.map((e)=><DataTouchable item={e}/>)}
		</ScrollView >
	)
}
function SettingContainer(props: {}) {
	return <View>

	</View>
}
function DataTouchable(props: { item: typeof app_cache.$inferSelect }) {
	const { item } = props
	return <TouchableOpacity className="flex-row justify-between" onPress={() => alert(
		JSON.stringify(
			item, undefined, 4))}>
		<SecondaryText className="truncate text-sm w-56" numberOfLines={1}>{item.key}</SecondaryText>
		<SecondaryText className="truncate text-sm">{deltaTime(Date.now() - (item.created_at?.getTime() || 0))}</SecondaryText>
	</TouchableOpacity>
}