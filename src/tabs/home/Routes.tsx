import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import useGetRouteList from "../../common/hooks/useGetRouteList"
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
import BasicRouteInformation from "../../common/interfaces/BasicRouteInformation"
import React, { useMemo, useState } from "react"
import RouteTouchableContainer from "../../components/routes/RouteTouchableContainer"
import CustomLoadingIndicator from "../../components/CustomLoadingIndicator"

import RouteList from "../../components/routes/RouteList"
import SegmentedButtons from "../../components/SegmentedButtons"
import FilterByRouteTypeModal from "../../components/routes/FilterByRouteTypeModal"
import RouteSearchBar from "../../components/routes/RouteSearchBar"
export default function Routes(props: {
	route: any
	navigation: NativeStackNavigationProp<any>
}) {
	const {
		data,
		isLoading,
		isError,
		error,
		refetch,
		isRefetching,
	} = useGetRouteList({ region: Application.region })

	const { navigation, route } = props
	const [searchText, setSearchText] = useState("")
	const [showFilter, setShowFilter] = useState(false)
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
				<RefreshControl
					refreshing={isLoading}
					onRefresh={refreshData}
				/>
				<Text>
					Unexpected Error: {JSON.stringify(error) || "unknown error"}
				</Text>
			</View>
		)
	}
	if (!data) {
		return (
			<View>
				<Text>No data found</Text>
			</View>
		)
	}
	if (!data.routeList) {
		refetch()
	}
	return (
		<React.Fragment>
			<RouteSearchBar onChangeText={setSearchText} setShowFilter={setShowFilter} />
			<FilterByRouteTypeModal
				filterByRouteType={filterByRouteType}
				setFilterByRouteType={setFilterByRouteType}
				visible={showFilter}
				setVisible={setShowFilter}
			/>
			<RouteList
				data={data}
				navigation={navigation}
				onRefresh={refreshData}
				refreshing={isRefetching}
				searchText={searchText}
				route={route}
				routeType={filterByRouteType.value}
			/>
		</React.Fragment>
	)
}
