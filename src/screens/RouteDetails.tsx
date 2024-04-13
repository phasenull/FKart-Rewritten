import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import BasicRouteInformation from "../common/interfaces/KentKart/object/BasicRouteInformation"
import { RefreshControl, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native"
import useGetRouteDetails from "../common/hooks/kentkart/info/useGetRouteDetails"
import CustomLoadingIndicator from "../components/CustomLoadingIndicator"
import RouteData from "../common/interfaces/KentKart/object/RouteData"
import { useEffect, useMemo, useState } from "react"
import BusData from "../common/interfaces/KentKart/object/BusData"
import BusContainer from "../components/route_details/BusContainer"
import Application from "../common/Application"

export default function RouteDetails(props: {
	route: {
		params?: {
			data_route?: BasicRouteInformation
			fetch_from_id?: string
			direction?: string
			bus_id?: string
		}
		path?: string
	}
	navigation: NativeStackNavigationProp<any>
}) {
	console.log("GO RouteDetails")
	const { navigation, route } = props

	const [direction, setDirection] = useState(parseInt(route?.params?.direction || "0") || 0)
	const [data_route, setDataRoute] = useState<RouteData | undefined>(route?.params?.data_route as any as RouteData)
	const id_to_fetch = data_route?.displayRouteCode || props.route.params?.fetch_from_id
	if (!id_to_fetch) {
		return (
			<View>
				<Text>Invalid route id</Text>
			</View>
		)
	}
	const { data, error, isLoading, refetch, isRefetching } = useGetRouteDetails({
		route_code: id_to_fetch,
		include_time_table: true,
		direction: direction,
	})
	useEffect(() => {
		if (data?.data?.result?.code !== 0) {
			refetch()
			return
		}
		const response_data = data?.data?.pathList[0]
		if (!response_data) {
			return
		}
		setDataRoute(response_data)
		if (!navigation) {
			return
		}
		navigation.setOptions({
			headerTitle: `${id_to_fetch} - ${response_data.headSign}`,
		})
		const bus_id = props.route.params?.bus_id
		if (!bus_id) return
		const bus = response_data.busList?.find((bus: BusData) => bus.busId === bus_id)
		if (!bus) {
			alert("Bus not found (is it still on road?)")
			navigation.setParams({ bus_id: undefined })
			return
		}
		navigation.navigate("map_data", {
			initial_bus: bus,
			route_data: response_data,
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

	if (!data?.data || !data_route) {
		return (
			<View>
				<Text>No data found</Text>
				<Text>{JSON.stringify(data?.data, null, 4)}</Text>
			</View>
		)
	}
	return (
		<ScrollView refreshControl={<RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetch} />}>
			<Text>
				Route Details {data_route.displayRouteCode} {direction}
			</Text>
			<Switch
				value={direction ? true : false}
				onValueChange={() => {
					setDirection(1 - direction)
				}}
			/>
			{/* <Text>BasicRouteInformation: {JSON.stringify(data_route, null, 4)}</Text> */}
			<ScrollView
				horizontal={true}
				contentContainerStyle={{
					padding: 20,
					columnGap: 20,
				}}
				className="w-full"
			>
				{data_route?.busList?.map((bus: BusData) => (
					<BusContainer route_data={data_route} navigation={navigation} bus={bus} key={`BusContainer-${bus.plateNumber}`} />
				))}
			</ScrollView>
			<View className="mt-5">
				<TouchableOpacity
					onPress={() =>
						navigation.navigate("map_data", {
							route_data: data?.data?.pathList[0],
							bus_list: data_route.busList,
						})
					}
					style={{ alignSelf: "center", elevation: 2, backgroundColor: Application.styles.primary, borderRadius: 16, paddingVertical: 2 * 4, paddingHorizontal: 4 * 4 }}
				>
					<Text>Open Map View</Text>
				</TouchableOpacity>
			</View>
			<View className="mt-5">
				<Text>
					HeadSign: {data_route.headSign} {"\n"}
					RouteCode: {data_route.displayRouteCode} {"\n"}
					Direction: {data_route.direction} {"\n"}
					tripShortName: {data_route.tripShortName} {"\n"}
					direction_name: {data_route.direction_name || '""'} {"\n"}
					path_code: {data_route.path_code} {"\n"}
					stopTimeList:{data_route.stopTimeList} {"\n"} {"\n"} {"\n"}
					busList: {JSON.stringify(data_route.busList, null, 4)} {"\n"}
					timeTableList : {JSON.stringify(data_route.timeTableList, null, 4)} {"\n"}
				</Text>
			</View>
		</ScrollView>
	)
}
