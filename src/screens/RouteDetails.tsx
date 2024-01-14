import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import BasicRouteInformation from "../common/interfaces/BasicRouteInformation"
import {
	RefreshControl,
	ScrollView,
	Switch,
	Text,
	View,
} from "react-native"
import useGetRouteDetails from "../common/hooks/useGetRouteDetails"
import CustomLoadingIndicator from "../components/CustomLoadingIndicator"
import RouteData from "../common/interfaces/RouteData"
import { useEffect, useState } from "react"
import BusData from "../common/interfaces/BusData"
import BusContainer from "../components/route_details/BusContainer"

export default function RouteDetails(props: {
	route: { params?: { data_route?: BasicRouteInformation } }
	navigation: NativeStackNavigationProp<any>
}) {
	const [direction, setDirection] = useState(1)
	const { navigation, route } = props
	const data_route = route?.params?.data_route
	if (!data_route) {
		return (
			<View>
				<Text>Route Details</Text>
				<Text>No route details found</Text>
			</View>
		)
	}
	const { data, error, isLoading, refetch, isRefetching } =
		useGetRouteDetails({
			route_data: data_route,
			include_time_table: true,
			direction: direction,
		})
	useEffect(() => {
		if (data?.data?.result?.code !== 0) {
			refetch()
			return
		}
		if (!navigation) {
			return
		}
		if (!finalRouteData || !data?.data?.pathList[0]) {
			return
		}
		navigation.setOptions({
			headerTitle: `${data_route.displayRouteCode} - ${data?.data?.pathList[0].headSign}`,
		})
	}, [data])

	if (isLoading || isRefetching) {
		return <CustomLoadingIndicator />
	}
	if (error) {
		return (
			<View>
				<Text>Error: {JSON.stringify(error, null, 4)}</Text>
			</View>
		)
	}

	const finalRouteData: RouteData = data?.data?.pathList
		? data.data.pathList[0]
		: undefined
	if (!data?.data || !finalRouteData) {
		return (
			<View>
				<Text>No data found</Text>
				<Text>{JSON.stringify(data?.data, null, 4)}</Text>
			</View>
		)
	}
	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={isLoading || isRefetching}
					onRefresh={refetch}
				/>
			}
		>
			<Text>
				Route Details {data_route.displayRouteCode} {direction}
			</Text>
			<Switch
				value={direction ? true : false}
				onValueChange={() => {
					setDirection(1 - direction)
				}}
			/>
			<Text>
				BasicRouteInformation: {JSON.stringify(data_route, null, 4)}
			</Text>
			<ScrollView
				horizontal={true}
				contentContainerStyle={{
					padding: 20,
					columnGap: 20,
				}}
				className="w-full"
			>
				{finalRouteData.busList.map((bus: BusData) => (
					<BusContainer
						route_data={finalRouteData}
						navigation={navigation}
						bus={bus}
						key={`BusContainer-${bus.plateNumber}`}
					/>
				))}
			</ScrollView>
			<View className="mt-5">
				<Text>
					HeadSign: {finalRouteData.headSign} {"\n"}
					RouteCode: {finalRouteData.displayRouteCode} {"\n"}
					Direction: {finalRouteData.direction} {"\n"}
					tripShortName: {finalRouteData.tripShortName} {"\n"}
					direction_name: {finalRouteData.direction_name || '""'}{" "}
					{"\n"}
					path_code: {finalRouteData.path_code} {"\n"}
					stopTimeList:{finalRouteData.stopTimeList} {"\n"} {"\n"}{" "}
					{"\n"}
					busList: {JSON.stringify(
						finalRouteData.busList,
						null,
						4
					)}{" "}
					{"\n"}
					timeTableList :{" "}
					{JSON.stringify(finalRouteData.timeTableList, null, 4)}{" "}
					{"\n"}
				</Text>
			</View>
		</ScrollView>
	)
}
