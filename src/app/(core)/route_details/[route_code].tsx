import { RefreshControl, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native"
import { useGetRouteDetails } from "common/hooks/kentkart/nonAuthHooks"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import { useContext, useEffect, useMemo, useState } from "react"
import BusData from "common/interfaces/KentKart/BusData"
import BusContainer from "components/reusables/BusContainer"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import ErrorPage from "../../ErrorPage"
import CardJSONData from "components/card_details/CardJSONData"
import { router, Stack, useLocalSearchParams } from "expo-router"

export default function RouteDetails() {
	const params = useLocalSearchParams()
	const force_direction = params.force_direction as string
	const route_code = params.route_code as string
	const headerTitle = params.headerTitle as string
	const bus_id = params.force_bus_id as string
	const [direction, setDirection] = useState(parseInt(force_direction || "0") || 0)
	const { theme } = useContext(ThemeContext)
	const user = useKentKartAuthStore((state) => state.user)
	const { data, error, isLoading, refetch, isRefetching, isError } = useGetRouteDetails({
		route_code: route_code,
		direction: direction,
		user: user as IKentKartUser,
		interval: 60_000,
		result_includes: {
			busList: true,
			scheduleList: true,
			timeTableList: true,
			busStopList: true,
		},
	})
	if (isLoading || isRefetching) {
		return <CustomLoadingIndicator style={{ flex: 1 }} />
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

	const route_data = data?.data?.pathList?.at(0)
	if (error || isError || !route_data) {
		return (
			<ErrorPage
				error={{
					title: "Nothing to see here!",
					description: "Tap retry to go back",
				}}
				retry={() => refetch()}
				other={{
					func: () => setDirection((old) => 1 - old),
					icon: "swap-horizontal-bold",
					description: `Switch Direction (${direction})`,
				}}
			/>
		)
	}
	return (
		<ScrollView refreshControl={<RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetch} />}>
			<Stack.Screen
				options={{
					headerTitle: `${route_data.displayRouteCode} - ${route_data.headSign}` || headerTitle,
					headerShown: true,
				}}
			/>
			<Text>
				Route Details {route_data?.displayRouteCode} {direction}
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
				{route_data?.busList?.map((bus: BusData) => (
					<BusContainer route_data={route_data} bus={bus} key={`BusContainer-${bus.plateNumber}`} />
				))}
			</ScrollView>
			<View className="mt-5">
				<TouchableOpacity
					onPress={() => router.navigate(`/map_details?force_route_code=${route_code}&force_direction=${direction}`)}
					style={{ alignSelf: "center", elevation: 2, backgroundColor: theme.primary, borderRadius: 16, paddingVertical: 2 * 4, paddingHorizontal: 4 * 4 }}
				>
					<Text>Open Map View</Text>
				</TouchableOpacity>
			</View>
			<CardJSONData card={{ ...route_data, busStopList: [], pointList: [] }} />
		</ScrollView>
	)
}
