import { useGetRealtime } from "common/hooks/kentkart/nonAuthHooks"
import { Stack } from "expo-router"
import React, { LegacyRef, useMemo, useRef, useState } from "react"
import MapView from "react-native-map-clustering"
import { PROVIDER_GOOGLE } from "react-native-maps"
import { busMarkerFromBus } from "../../components/r8r/ClusterMarker"
import OverlayRoot from "../../components/r8r/overlay/OverlayRoot"
import ErrorPage from "../ErrorPage"
import ApplicationConfig from "common/ApplicationConfig"
import { useQuery } from "react-query"

export default function R8R() {
	const map = useRef<MapView>()
	// when the city-wide GTFS-RT feed is down, show the buses of favorite routes instead
	const { data: fav_data } = useQuery(["get_favs"], {
		queryFn: async () => {
			return (await ApplicationConfig.database.get("favs.routes")) || []
		},
	})
	const fallback_route_codes: string[] = fav_data?.map((e: any) => e.object_id).filter(Boolean) || []
	const { data, isLoading, isError, error, refetch, isRefetching } = useGetRealtime(fallback_route_codes)
	const renderedMarkers = (

		data?.feed?.map((e) => {
			return busMarkerFromBus(e as any)
		})
	)
	if (isError && !(data && data.feed)) {
		return <ErrorPage retry={isRefetching ? () => null : refetch} error={{ description: (error as any).message, title: "Couldn't fetch RT" }} />
	}
	return (
		<React.Fragment>
			<Stack.Screen options={{
				headerShown: true,
				title: `${data?.feed?.length || 0} buses${data?.source === "route_info" ? " (favorites only)" : ""} ${new Date().toISOString().slice(0, 19)}`
			}} />
			<OverlayRoot isRefetchLoading={isLoading || isRefetching} refetchFn={refetch} />
			<MapView
				// minZoom={12}
				radius={40}
				minPoints={3}
				showsUserLocation={true}
				ref={map as LegacyRef<MapView>}
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
		</React.Fragment>
	)
}
