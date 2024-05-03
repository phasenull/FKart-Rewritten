import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import useGetRouteList from "../../common/hooks/fkart/static/useGetRouteList"
import Application from "../../common/Application"
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
import BasicRouteInformation from "../../common/interfaces/KentKart/object/BasicRouteInformation"
import React, { useMemo, useState } from "react"
import RouteTouchableContainer from "../../components/routes/RouteTouchableContainer"
import CustomLoadingIndicator from "../../components/CustomLoadingIndicator"

import RouteList from "../../components/routes/RouteList"
import SegmentedButtons from "../../components/SegmentedButtons"
import FilterByRouteTypeModal from "../../components/routes/FilterByRouteTypeModal"
import RouteSearchBar from "../../components/routes/RouteSearchBar"
export default function SearchTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const { data, isLoading, isError, error, refetch, isRefetching } = useGetRouteList({ region: Application.region })

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
	if (isLoading || isRefetching) {
		return <CustomLoadingIndicator />
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
			<View>
				<Text>No data found</Text>
			</View>
		)
	}
	if (!data?.data.routeList) {
		refetch()
	}
	return (
		<View className="flex-1">
			<View style={{elevation:20,zIndex:2, backgroundColor:Application.styles.dark}}>
				<RouteSearchBar onChangeText={setSearchText} filterByRouteType={filterByRouteType} setFilterByRouteType={setFilterByRouteType} />
				<View className="mt-3 h-4 gap-x-4 flex-row justify-center mb-3">
					{[
						{
							key:"koy_minibusu",
							color: "#C60D0D",
							value: "Köy Minibüsü",
						},
						{
							key:"ozel_halk_otobusu",
							color: Application.styles.primary,
							value: "Özel Halk Otobüsü",
						},
						{
							key:"belediye_otobusu",
							color: "#1EA9BD",
							value: "Belediye Otobüsü",
						},
						{
							key:"feribot",
							color: "#134395",
							value: "Feribot",
						},
					].map((item) => {
						return (
							<View key={item.value} className="justify-center flex-col">
								<View style={{ width: 3 * 4, height: 3 * 4, backgroundColor: item.color }} className="self-center" />
								<Text style={{ color: Application.styles.secondary, fontWeight: "800" }}>{item.value}</Text>
							</View>
						)
					})}
				</View>
			</View>
			<RouteList data={data.data} navigation={navigation} onRefresh={refreshData} refreshing={isRefetching} searchText={searchText} route={route} routeType={filterByRouteType.value} />
		</View>
	)
}
