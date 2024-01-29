import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import BasicRouteInformation from "../common/interfaces/BasicRouteInformation"
import { RefreshControl, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native"
import useGetRouteDetails from "../common/hooks/useGetRouteDetails"
import CustomLoadingIndicator from "../components/CustomLoadingIndicator"
import RouteData from "../common/interfaces/RouteData"
import { useEffect, useState } from "react"
import BusData from "../common/interfaces/BusData"
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
	const { navigation, route } = props

	const [direction, setDirection] = useState(parseInt(route?.params?.direction || "0") || 0)
	const [data_route, setDataRoute] = useState<RouteData | undefined | BasicRouteInformation>(route?.params?.data_route)
	if (!data_route) {
		// get data from path
		const target_id = route?.params?.fetch_from_id
		const p_direction = route?.params?.direction
		const bus_id = route?.params?.bus_id
		if (!target_id) {
			return (
				<View>
					<Text>Route Details</Text>
					<Text>No route details found</Text>
					<Text>Params: {JSON.stringify(route.params, null, 4)}</Text>
				</View>
			)
		}

		console.log(`GOT DEEPLINKING, FETCHING ROUTE FROM ID: ${target_id}`, route.params)

		const { data, error, isLoading, refetch, isRefetching } = useGetRouteDetails({
			route_code: target_id,
			include_time_table: true,
			direction: direction,
		})
		useEffect(() => {
			if (data?.data?.result?.code !== 0) {
				refetch()
				return
			}
			if (!navigation) return
			if (!data?.data?.pathList[0]) return
			const path = data?.data?.pathList[0]
			setDataRoute(path)
			if (!bus_id) return
			if (!path.busList) return
			console.log("bus_id", bus_id,path.busList)
			const bus = path.busList.filter((bus: BusData) => bus.busId === bus_id)[0]
			console.log("bus", bus)
			if (!bus) return alert("Can't find bus on this route (Is it still on road?)")
			navigation.navigate("map_data", {
				route_data: path,
				bus_list: path.busList,
				initial_bus: bus,
			})
		}, [data])
		return <CustomLoadingIndicator />
	}
	const { data, error, isLoading, refetch, isRefetching } = useGetRouteDetails({
		route_code: data_route.displayRouteCode,
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

	const finalRouteData: RouteData = data_route as RouteData
	if (!data?.data || !finalRouteData) {
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
				{finalRouteData.busList.map((bus: BusData) => (
					<BusContainer route_data={finalRouteData} navigation={navigation} bus={bus} key={`BusContainer-${bus.plateNumber}`} />
				))}
			</ScrollView>
			<View className="mt-5">
				<TouchableOpacity
					onPress={() =>
						navigation.navigate("map_data", {
							route_data: data?.data?.pathList[0],
							bus_list: finalRouteData.busList,
						})
					}
					style={{ alignSelf: "center", elevation: 2, backgroundColor: Application.styles.primary, borderRadius: 16, paddingVertical: 2 * 4, paddingHorizontal: 4 * 4 }}
				>
					<Text>Open Map View</Text>
				</TouchableOpacity>
			</View>
			<View className="mt-5">
				<Text>
					HeadSign: {finalRouteData.headSign} {"\n"}
					RouteCode: {finalRouteData.displayRouteCode} {"\n"}
					Direction: {finalRouteData.direction} {"\n"}
					tripShortName: {finalRouteData.tripShortName} {"\n"}
					direction_name: {finalRouteData.direction_name || '""'} {"\n"}
					path_code: {finalRouteData.path_code} {"\n"}
					stopTimeList:{finalRouteData.stopTimeList} {"\n"} {"\n"} {"\n"}
					busList: {JSON.stringify(finalRouteData.busList, null, 4)} {"\n"}
					timeTableList : {JSON.stringify(finalRouteData.timeTableList, null, 4)} {"\n"}
				</Text>
			</View>
		</ScrollView>
	)
}
