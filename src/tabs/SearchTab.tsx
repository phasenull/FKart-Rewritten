import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import useGetRouteList from "common/hooks/fkart/static/useGetRouteList"
import ApplicationConfig from "common/ApplicationConfig"
import {
	ActivityIndicator,
	FlatList,
	Keyboard,
	Modal,
	RefreshControl,
	Text,
	TextInput,
	TouchableHighlight,
	TouchableOpacity,
	TouchableWithoutFeedback,
	TouchableWithoutFeedbackComponent,
	View,
} from "react-native"
import React, { useContext, useMemo, useState } from "react"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"

import RouteList from "components/tab_components/routes/RouteList"
import RouteSearchBar from "components/tab_components/routes/RouteSearchBar"
import SecondaryText from "components/reusables/SecondaryText"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import ErrorPage from "screens/ErrorPage"
export default function SearchTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const user = useKentKartAuthStore((state) => state.user)
	const { data, isLoading, isError, error, refetch, isRefetching } = useGetRouteList()
	const { theme } = useContext(ThemeContext)
	const { navigation, route } = props
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
	if (isError) {
		return (
			<View>
				<RefreshControl refreshing={isLoading} onRefresh={refreshData} />
				<Text>Unexpected Error: {JSON.stringify(error) || "unknown error"}</Text>
			</View>
		)
	}
	if (!data?.data) {
		return (
			<View className="items-center justify-center flex-1">
				<SecondaryText>No data found</SecondaryText>
			</View>
		)
	}
	if (!data?.data.routeList && !(isLoading||isRefetching)) {
		return <ErrorPage retry={refetch} error={{title:"No Routes!",description:"Server did not respond any routes in provided city, this could be an issue with "}} />
	}
	return (
		<View className="flex-1">
			<View style={{ elevation: 20, zIndex: 2, backgroundColor: theme.dark }}>
				<RouteSearchBar onChangeText={setSearchText} filterByRouteType={filterByRouteType} setFilterByRouteType={setFilterByRouteType} />
				<View className="mt-3 h-4 gap-x-4 flex-row justify-center mb-3">
					{[
						{
							key: "koy_minibusu",
							color: "#C60D0D",
							value: "Köy Minibüsü",
						},
						{
							key: "ozel_halk_otobusu",
							color: theme.primary,
							value: "Özel Halk Otobüsü",
						},
						{
							key: "belediye_otobusu",
							color: "#1EA9BD",
							value: "Belediye Otobüsü",
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
			{isLoading || isRefetching ? (
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
			) : (
				<RouteList data={data.data} navigation={navigation} onRefresh={refreshData} refreshing={isRefetching} searchText={searchText} route={route} routeType={filterByRouteType.value} />
			)}
		</View>
	)
}
