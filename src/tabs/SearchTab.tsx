import useGetRouteList from "common/hooks/fkart/static/useGetRouteList"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import React, { useContext, useState } from "react"
import {
	Text,
	View
} from "react-native"

import ErrorPage from "app/ErrorPage"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import SecondaryText from "components/reusables/SecondaryText"
import RouteList from "components/tab_components/routes/RouteList"
import RouteSearchBar from "components/tab_components/routes/RouteSearchBar"
export default function SearchTab() {
	const user = useKentKartAuthStore((state) => state.user)
	const { data, isLoading, isError, error, refetch, isRefetching } = useGetRouteList()
	const { theme } = useContext(ThemeContext)
	const [searchText, setSearchText] = useState("")
	const [filterByRouteType, setFilterByRouteType] = useState<{
		key: string
		label?: string
		value?: any
		onPress?: any
	}>({ key: "all" })

	function refreshData() {
		console.log("refreshing data")
		refetch()
	}

	// ik its a bad design but it works
	let contain
	if (isError) {
		contain = <ErrorPage retry={refetch} error={{ title: "Request Error", description: (error as any).response.data?.result?.error || "Unknown error" }} />
	} else if (!data?.data.routeList && !(isLoading || isRefetching)) {
		contain = <ErrorPage retry={refetch} error={{ title: "No Routes!", description: "Server did not respond any routes in provided city, this could be an issue with " }} />
	} else if (isLoading) {
		contain = (
			<View className="flex-1 justify-center items-center mb-32">
				<CustomLoadingIndicator size={48} />
				<SecondaryText
					style={{
						marginTop: 12 * 4,
						fontSize: 32,
					}}
				>
					Fetching data...
				</SecondaryText>
			</View>
		)
	} else if (!data?.data) {
		contain = (
			<ErrorPage retry={refetch} error ={{title:"No data found"}}/>
		)
	} else if (data?.data && data?.data.routeList) {
		contain = <RouteList data={data.data} onRefresh={refreshData} refreshing={isRefetching || isLoading} searchText={searchText} routeType={filterByRouteType.value} />
	} else {
		contain = <ErrorPage error={{ title: "Unknown Error", description: "Unknown state (no error, no routeList, data found)" }} retry={refetch} />
	}
	return (
		<View className="flex-1">
			<View style={{ elevation: 20, zIndex: 2, backgroundColor: theme.dark }}>
				<RouteSearchBar onChangeText={setSearchText} filterByRouteType={filterByRouteType} setFilterByRouteType={setFilterByRouteType} />
				<View className="mt-3 h-4 space-x-3 flex-row justify-center px-4 mb-3">
					{[
						{
							key: "koy_minibusu",
							color: "#C60D0D",
							value: "Kırsal Mahalle",
						},
						{
							key: "ozel_halk_otobusu",
							color: theme.primary,
							value: "Ö. Halk Otobüsü",
						},
						{
							key: "belediye_otobusu",
							color: "#1EA9BD",
							value: "UlaşımPark A.Ş.",
						},
						{
							key: "feribot",
							color: "#134395",
							value: "Feribot",
						},
					].map((item) => {
						return (
							<View key={item.value} className="justify-center flex-col">
								<View style={{ width: 3 * 4, height: 3 * 4, backgroundColor: item.color }} className="self-center" />
								<Text style={{ color: theme.secondary, fontWeight: "800" }}>{item.value}</Text>
							</View>
						)
					})}
				</View>
			</View>
			{contain}
		</View>
	)
}
