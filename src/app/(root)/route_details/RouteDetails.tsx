import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import BasicRouteInformation from "common/interfaces/KentKart/BasicRouteInformation"
import { RefreshControl, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native"
import { useGetRouteDetails } from "common/hooks/kentkart/nonAuthHooks"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import RouteData from "common/interfaces/KentKart/RouteData"
import { useContext, useEffect, useMemo, useState } from "react"
import BusData from "common/interfaces/KentKart/BusData"
import BusContainer from "./BusContainer"
import ApplicationConfig from "common/ApplicationConfig"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import ErrorPage from "../ErrorPage"
import CardJSONData from "../card_details/CardJSONData"

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
	const [data_route, setDataRoute] = useState<RouteData | undefined>(route?.params?.data_route as any as RouteData)
	const id_to_fetch = data_route?.displayRouteCode || props.route.params?.fetch_from_id
	if (!id_to_fetch) {
		return (
			<View>
				<Text>Invalid route id</Text>
			</View>
		)
	}
	const { theme } = useContext(ThemeContext)
	const user = useKentKartAuthStore((state) => state.user)
	const { data, error, isLoading, refetch, isRefetching } = useGetRouteDetails({
		route_code: id_to_fetch,
		direction: direction,
		user: user as IKentKartUser,
		interval: 60_000,
		result_includes: {
			busList: true,
			scheduleList: true,
			timeTableList: true,
		},
	})
	useEffect(() => {
		if (data?.data?.result?.code !== 0) {
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
	if (isLoading) {
		return <CustomLoadingIndicator />
	}
	if (error) {
		return (
			<ErrorPage
				error={{
					title: "Cant fetch routes",
					description: JSON.stringify(error, null, 4),
				}}
				retry={refetch}
			/>
		)
	}

	if (!data?.data || !data_route) {
		return (
			<ErrorPage
				error={{
					title: "Nothing to see here!",
					description: "Server did not respond any valid data",
				}}
				retry={refetch}
			/>
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
					style={{ alignSelf: "center", elevation: 2, backgroundColor: theme.primary, borderRadius: 16, paddingVertical: 2 * 4, paddingHorizontal: 4 * 4 }}
				>
					<Text>Open Map View</Text>
				</TouchableOpacity>
			</View>
			<CardJSONData card={data_route} />
		</ScrollView>
	)
}
