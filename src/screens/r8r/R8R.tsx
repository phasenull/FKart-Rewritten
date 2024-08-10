import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useGetRealtime } from "common/hooks/kentkart/nonAuthHooks"
import SimplyButton from "components/ui/SimplyButton"
import React, { LegacyRef, useEffect, useMemo, useRef } from "react"
import { View } from "react-native"
import { PROVIDER_GOOGLE } from "react-native-maps"
import MapView from "react-native-map-clustering"
import ErrorPage from "screens/ErrorPage"
import { busMarkerFromBus } from "./ClusterMarker"

export default function R8R(props: { navigation: NativeStackNavigationProp<any> }) {
	const map = useRef<MapView>()
	const { data, isLoading, isError, error, refetch, isRefetching } = useGetRealtime()
	useEffect(() => {
		// refetchClusters()
		props.navigation.setOptions({ title: `${data?.feed.length || 0} buses ${new Date().toISOString().slice(0, 19)}` })
	}, [data])
	if (isError && !(data && data.feed)) {
		return <ErrorPage retry={isRefetching ? () => null : refetch} error={{ description: (error as any).message, title: "Couldn't fetch RT" }} />
	}
	const renderedMarkers = useMemo(
		() =>
			data?.feed?.map((e) => {
				return busMarkerFromBus(e as any, props.navigation)
			}),
		[data]
	)
	return (
		<React.Fragment>
			<View className="absolute bottom-4 flex flex-row self-center">
				<SimplyButton
					text="refetch"
					size="medium"
					style={{
						zIndex: 4,
					}}
					onPress={() => refetch()}
					disabled={isRefetching || isLoading}
				/>
			</View>

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
