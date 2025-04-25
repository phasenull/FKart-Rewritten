import { ThemeContext } from "common/contexts/ThemeContext";
import { useGetVTSKeys, useSearchBus } from "common/hooks/kk-vts/hooks";
import { deltaTime } from "common/util";
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator";
import SecondaryText from "components/reusables/SecondaryText";
import SimplyTextInput from "components/ui/SimplyTextInput";
import { useContext, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import BusRow from "./bus_row";
import SimplyButton from "components/ui/SimplyButton";
import ErrorPage from "app/ErrorPage";
import { router } from "expo-router";

export default function Picker() {
	const [searchString, setSearchString] = useState<string | undefined>()
	const { data: bus_list, isLoading,refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useSearchBus(searchString || "41 ")
	const { theme } = useContext(ThemeContext)
	if (!(isFetchingNextPage||isLoading)&&(!bus_list || !bus_list.pages.length)) return <ErrorPage other={{
		description:"\nChange server url\n(http://host:port)",
		icon:"server",
		func:()=>{
			router.navigate({pathname:"/(dev)/AppData",params:{ fill_key: "kk_vts_api" }})
		}
	}} retry={refetch} error={
		{
			title: "Can't find buses",
			description: "Server did not return any valid data!"
		}} />
	return <View>
		<SimplyTextInput placeholder="Search Plate" value={searchString} onChangeText={setSearchString}>
		</SimplyTextInput>
		{isLoading && <CustomLoadingIndicator color={theme.secondary} size={16 * 4} />}
		<FlatList
		className="h-[80%]"
		onEndReached={()=>{
			if (bus_list?.pages?.length >= 5) return
			if (isFetchingNextPage || !(bus_list?.pages?.at(bus_list?.pages?.length - 1)?.data?.length >= 5)) return
			fetchNextPage()
		}}
			maxToRenderPerBatch={10}
			data={bus_list?.pages?.map((e: any) => e.data).flat()} renderItem={({ item, index }) => <BusRow bus_data={
				item} />
			}>
		</FlatList>
		<SimplyButton disabled={!(bus_list?.pages?.at(bus_list?.pages?.length - 1)?.data?.length >= 5)} processing={isFetchingNextPage} text="load more" size="medium" className="w-40 self-center mt-5" onPress={() => fetchNextPage()} />
	</View>
}