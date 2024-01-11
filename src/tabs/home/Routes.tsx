import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import useGetRouteList from "../../common/hooks/useGetRouteList"
import Application from "../../common/Application"
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native"
import BasicRouteInformation from "../../common/interfaces/BasicRouteInformation"
import { useMemo, useState } from "react"
import RouteTouchableContainer from "../../components/containers/RouteTouchableContainer"
import CustomLoadingIndicator from "../../components/CustomLoadingIndicator"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import RouteList from "../../components/containers/RouteList"
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
	function refreshData() {
		console.log("refreshing data")
		refetch()
	}
	const routeList = useMemo(
		() => (
			<RouteList
				data={data}
				navigation={navigation}
				onRefresh={refreshData}
				refreshing={isRefetching}
				searchText={searchText}
				route={route}
			/>
		),
		[searchText,data]
	)
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
		<View>
			<View
				className="absolute w-80 mt-2 px-4 rounded-full items-center justify-center self-center flex-row"
				style={{
					backgroundColor: Application.styles.white,
					elevation: 10,
					shadowOffset: { height: 4, width: 4 },
					zIndex: 100,
				}}
			>
				<TextInput
					className="mx-1 h-16 bg-transparent flex-1"
					onChangeText={(text) => setSearchText(text)}
					placeholder="Search Routes"
					style={{
						color: Application.styles.secondaryDark,
						fontSize: 16,
					}}
					value={searchText}
				/>
				<MaterialCommunityIcons
					color={Application.styles.secondary}
					size={28}
					name="magnify"
				/>
			</View>
			{routeList}
		</View>
	)
}
