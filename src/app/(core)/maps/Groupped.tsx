import { drizzleDB } from "app/_layout";
import { favorites } from "common/schema";
import SecondaryText from "components/reusables/SecondaryText";
import { eq } from "drizzle-orm";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useQuery } from "react-query";

export default function GrouppedMap() {
	const { isLoading, data } = useQuery(["drizzle.get_groupped_routes"], {
		queryFn: async () => {
			return await drizzleDB.select().from(favorites).where(eq(favorites.type, "route")).all()
		}
	})
	if (!data?.length) return <View className="flex-1 items-center justify-center"><SecondaryText>No groups found!{"\n"}You can add new routes from the search/[route] page</SecondaryText></View>
	return <Stack.Screen options={{ headerShown: true }}>

	</Stack.Screen>
}