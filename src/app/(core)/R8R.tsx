import { useGetRealtime } from "common/hooks/kentkart/nonAuthHooks"
import { Stack } from "expo-router"
import React, { LegacyRef, useMemo, useRef } from "react"
import MapView from "react-native-map-clustering"
import { PROVIDER_GOOGLE } from "react-native-maps"
import { busMarkerFromBus } from "../../components/r8r/ClusterMarker"
import OverlayRoot from "../../components/r8r/overlay/OverlayRoot"
import ErrorPage from "../ErrorPage"

export default function R8R() {
	const map = useRef<MapView>()
	const { data, isLoading, isError, error, refetch, isRefetching } = useGetRealtime()
	const renderedMarkers = useMemo(
		() =>
			data?.feed?.map((e) => {
				return busMarkerFromBus(e as any)
			}),
		[data]
	)
	if (isError && !(data && data.feed)) {
		return <ErrorPage retry={isRefetching ? () => null : refetch} error={{ description: (error as any).message, title: "Couldn't fetch RT" }} />
	}
	return (
		<React.Fragment>
			<Stack.Screen options={{
				headerShown:true,
				title: `${data?.feed?.length || 0} buses ${new Date().toISOString().slice(0, 19)}`
			}}/>
			<OverlayRoot isRefetchLoading={isLoading||isRefetching} refetchFn={refetch} />
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
