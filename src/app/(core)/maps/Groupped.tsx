import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, { TouchableOpacity } from "@gorhom/bottom-sheet"

import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import ErrorPage from "app/ErrorPage";
import ApplicationConfig from "common/ApplicationConfig";
import { ThemeContext } from "common/contexts/ThemeContext";
import { useGetRealtime } from "common/hooks/kentkart/nonAuthHooks";
import { useGetVehicleEvents } from "common/hooks/kk-vts/hooks";
import { groupBy } from "common/util";
import { busMarkerFromBus } from "components/r8r/ClusterMarker";
import OverlayRoot from "components/r8r/overlay/OverlayRoot";
import BusContainer from "components/reusables/BusContainer";
import HorizontalDivider from "components/reusables/HorizontalDivider";
import SecondaryText from "components/reusables/SecondaryText";
import { router, Stack } from "expo-router";
import { transit_realtime } from "gtfs-realtime-bindings";
import React, { LegacyRef, Ref, useContext, useRef, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler"

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useQueries, useQuery } from "react-query";

export default function GrouppedMap() {
	const [followingBus, setFollowingBus] = useState<transit_realtime.IFeedEntity>()
	const { data: fav_data } = useQuery(["get_favs"], {
		queryFn: async () => {
			return await ApplicationConfig.database.get("favs.routes") || []
		}
	})
	const ref_map_view = useRef<MapView>()
	const ref_bottom_sheet = useRef<BottomSheet>()
	const { theme } = useContext(ThemeContext)
	const flatted = fav_data?.map((e: any) => e.object_id)
	// console.log("flatted", flatted)
	const { data, isLoading, isError, error, refetch, isRefetching } = useGetRealtime()
	function getFavDataFromRouteId(routeId: string) {
		return fav_data?.find((e: any) => e.object_id === routeId)
	}
	const filtered: transit_realtime.IFeedEntity[] = data?.feed?.filter((e) => flatted.includes(e.vehicle?.trip?.routeId?.split("|")[0])) as any
	const renderedMarkers = filtered?.map((e: any) => {
		const fav_data = getFavDataFromRouteId((e.vehicle?.trip?.routeId)?.split("|")[0])
		const color = fav_data?.extras?.color
		return busMarkerFromBus(e as any, color)
	})
	const results = useQueries(
		filtered?.map((e) => ({
			queryKey: ["search-bus", e.vehicle?.vehicle?.id?.split("|")[0]],
			queryFn: async () => {
				const vehicle_id = (e.vehicle?.vehicle?.id?.split("|")[0].replaceAll(".", "").replaceAll("/", ""))
				const API = await ApplicationConfig.database.get("kk_vts_api")
				const url = `${API}/api/events/search?key=bus&value=${vehicle_id}`
				if (!API) router.navigate({ pathname: "/AppData", params: { fill_key: "kk_vts_api" } })
				const response = await fetch(url)
				const json = await response.json()
				console.log("getVehicleEvents", e.vehicle?.vehicle?.id, json?.data?.length)
				return {
					vehicle_id: vehicle_id, events: json?.data as {
						"created_at": string,
						"license_plate": string,
						"vehicle_id": number,
						"trip_id": number,
						"route_code": number,
						"direction": 0 | 1,
						"event_label": string
					}[]
				}
			},
			cacheTime: 10 * 60 * 1000,
			staleTime: 1 * 60 * 1000,
		})) || [])
	if (!fav_data?.length) return <View className="flex-1 items-center justify-center"><SecondaryText>No groups found!{"\n"}You can add new routes from the search/[route] page</SecondaryText></View>
	if (isError && !(data && data.feed)) {
		return <ErrorPage retry={isRefetching ? () => null : refetch} error={{ description: (error as any).message, title: "Couldn't fetch RT" }} />
	}

	return (
		<React.Fragment>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: `Group View`,
					headerTitleStyle: {
						color: theme.secondary,
						fontWeight: "900",
					},
				}}
			/>
			{/* <OverlayRoot isRefetchLoading={isLoading || isRefetching} refetchFn={refetch} /> */}
			<View className="self-center row-span-2 flex flex-row space-x-4 w-[90%] absolute ml-2 mt-2 py-1 px-2 z-50" style={{
				borderColor: theme.secondary,
				borderRadius: 2 * 4,
				borderWidth: 1 * 4,
				backgroundColor: theme.white
			}}>
				{fav_data?.map((e: any) =>
					<View className="flex-1 flex-row space-x-1 items-center justify-center">
						<View className="w-4 h-4" style={{ backgroundColor: e.extras?.color }} />
						<SecondaryText>
							{e.object_id}
						</SecondaryText>
					</View>
				)}
			</View>
			<MapView
				// minZoom={12}
				showsUserLocation={true}
				ref={ref_map_view as LegacyRef<MapView>}
				initialRegion={{
					latitude: 40.75919,
					longitude: 29.943218,
					longitudeDelta: 0.05,
					latitudeDelta: 0.05,
				}}
				provider={PROVIDER_GOOGLE}
				style={{ flex: 1 }}
			>
				{renderedMarkers}
			</MapView>
			<BottomSheet
				ref={ref_bottom_sheet as Ref<BottomSheetMethods>}
				backgroundStyle={{
					backgroundColor: theme.dark,
					// width:"100%"
				}}
				snapPoints={["12%", "35%", "90%"]}
				index={1}
				enablePanDownToClose={false}
			>
				<ScrollView
					scrollEnabled={true}
					horizontal={true}
					style={{
						// width:60*4,
						flex: 1

					}}
					contentContainerStyle={{
						paddingHorizontal: 20,
						columnGap: 20,
						// height: 120 * 4,
					}}
				>
					{filtered?.sort((bus_a: any, bus_b: any) => parseInt(bus_a.seq || "0") - parseInt(bus_b.seq || "0"))
						?.map((bus: transit_realtime.IFeedEntity) => {
							// console.log("bus data", bus.vehicle?.vehicle?.licensePlate)
							const bus_id = bus.vehicle?.vehicle?.id?.split("|")[0]
							// const atStop = getStopFromStopId(bus.stopId)
							const event_datas = results.find(
								(e) => e.data?.vehicle_id === bus_id
							)?.data?.events.slice(0, 45) || []
							return (
								<BusContainer
									override_header={{
										data:bus,
										color:getFavDataFromRouteId((bus.vehicle?.trip?.routeId)?.split("|").at(0) as string)?.extras?.color,
										route_code:(bus.vehicle?.trip?.routeId)?.split("|").at(0) as string||"?"
									}}
									route_data={{} as any}
									onLongPress={() => {
										// Clipboard.setString(`fkart://map_details?force_route_code=${routeDataToShow.displayRouteCode}&force_direction=${direction}&force_bus_id=${bus.busId}`)
										// ToastAndroid.show("Link kopyalandı!", ToastAndroid.SHORT)
										// Vibration.vibrate(100)
									}}
									onPress={() => {
										ref_map_view.current?.animateToRegion({
											latitude: (bus.vehicle?.position?.latitude as any) - 0.001,
											longitude: (bus.vehicle?.position?.longitude as any),
											latitudeDelta: 0.02,
											longitudeDelta: 0.02,
										})
										setFollowingBus(bus)
										ref_bottom_sheet.current?.snapToIndex(1)
									}}
									
									bus={{
										plateNumber: bus.vehicle?.vehicle?.licensePlate || "??",
										seq: bus.vehicle?.currentStopSequence,
										stopId: bus.vehicle?.stopId
									} as any}
									key={`BusContainer-${bus.vehicle?.vehicle?.licensePlate}`}
								>
									{Object.entries(groupBy(
										event_datas, (e) => e?.created_at?.slice(0, 10) as string
										// !!!IDK WHAT WENT WRONG WITH THE TYPING BUT DO NOT REMOVE THE []
									)).map(([key, value]) => {
										// console.log(`${value?.length} items for key ${key}`)
										let is_active: typeof value[0] | undefined = undefined
										if (value.at(0)?.event_label === "vehicle_created") {
											is_active = value.at(0) as any
											value.shift()
										}
										const paired = groupBy(
											value, (e, i) =>(i-i % 2).toString()
										)
										// console.log(Object.keys(paired).length)
										return <View className="flex-col pl-2">
											<SecondaryText style={{ color: theme.primaryDark }}>
												{key}
											</SecondaryText>
											<SecondaryText numberOfLines={Object.keys(paired).length + (is_active ? 1 : 0)} className="ml-2 text-sm">
												{is_active && (`${is_active.route_code} ${is_active.direction?"<-":"->"} | `+new Date(is_active?.created_at)?.toLocaleTimeString().slice(0, 5)
													+ " -> NOW \n")
												}
												{
													Object.entries(paired).map(
														([k, [destroyed, created]]) =>
															`${created?.route_code} ${created?.direction?"<-":"->"} | ` +
															new Date(created?.created_at).toLocaleTimeString().slice(0, 5) + " -> " + new Date(destroyed?.created_at).toLocaleTimeString().slice(0, 5)
													).join("\n")

												}
											</SecondaryText>

										</View>
									})}
								</BusContainer>
							)
						})}
				</ScrollView>
			</BottomSheet>
		</React.Fragment>)
}

