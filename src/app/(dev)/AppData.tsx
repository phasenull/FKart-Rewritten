import { MaterialCommunityIcons } from "@expo/vector-icons";
import ErrorPage from "app/ErrorPage";
import ApplicationConfig from "common/ApplicationConfig";
import { ThemeContext } from "common/contexts/ThemeContext";
import Logger from "common/Logger";
import { deltaTime } from "common/util";
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator";
import SecondaryText from "components/reusables/SecondaryText";
import SimplyButton from "components/ui/SimplyButton";
import SimplyTextInput from "components/ui/SimplyTextInput";
import { Stack, useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-vector-icons/Icon";
import { useMutation, useQuery } from "react-query";

export default function AppData() {
	const { theme } = useContext(ThemeContext)
	const { fill_key } = useLocalSearchParams()
	// a very poor way to handle forms
	const [form, setForm] = useState<{ key: string, value: string }>({ key: fill_key as string, value: "true" })
	const { mutate } = useMutation({
		mutationKey: "force-set-db", mutationFn: async (props: { key: string, value: any }) => {
			const { key, value } = props
			await ApplicationConfig.database.set(key, value)
		}
	})
	return (
		<ScrollView contentContainerStyle={{alignItems:"center"}} className="flex-1">
			<Stack.Screen options={{ headerShown: true }} />

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
		</ScrollView >
	)
}
function SettingContainer(props: {}) {
	return <View>

	</View>
}