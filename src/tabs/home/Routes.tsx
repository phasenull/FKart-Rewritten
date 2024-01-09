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
import RouteData from "../../common/interfaces/RouteData"
import { useMemo } from "react"
import RouteTouchableContainer from "../../components/containers/RouteTouchableContainer"
import CustomLoadingIndicator from "../../components/CustomLoadingIndicator"

export default function Routes(props: {
	route: any
	navigation: NativeStackNavigationProp<any>
}) {
	function renderRoute({
		index,
		item,
	}: {
		index: number
		item: RouteData
	}) {
		return (
			<RouteTouchableContainer
				item={item}
				navigation={props.navigation}
				route={props.route}
			/>
		)
	}
	const {
		data,
		isLoading,
		isError,
		error,
		refetch,
		isRefetching,
	} = useGetRouteList({ region: Application.region })
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
	if (data) {
		if (!data.routeList) {
			refetch()
		}
		return (
			<View>
				<TextInput
					className="absolute w-80 self-center my-2 h-12 px-4 mx-4 rounded-full"
					style={{
						backgroundColor: Application.styles.white,
						elevation: 10,
						color: Application.styles.primary,
						shadowOffset: { height: 4, width: 4 },
						zIndex: 100,
					}}
					placeholder="Search Routes"
				/>
				<FlatList
					refreshControl={
						<RefreshControl
							refreshing={isRefetching}
							onRefresh={refreshData}
						/>
					}
					className="z-10"
					contentContainerStyle={{ paddingTop: 60 }}
					maxToRenderPerBatch={10}
					data={data.routeList?.slice(0, 25)}
					renderItem={renderRoute}
				/>
			</View>
		)
	}
}
