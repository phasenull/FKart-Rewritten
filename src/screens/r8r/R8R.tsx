import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useGetRealtime } from "common/hooks/kentkart/nonAuthHooks"
import SimplyButton from "components/ui/SimplyButton"
import React, { LegacyRef, useEffect, useRef } from "react"
import { View } from "react-native"
import { PROVIDER_GOOGLE } from "react-native-maps"
import MapView from "react-native-map-clustering"
import ErrorPage from "screens/ErrorPage"
import { busMarkerFromBus } from "./ClusterMarker"

export default function R8R(props: { navigation: NativeStackNavigationProp<any> }) {
	const map = useRef<MapView>()
	const { data, isLoading, isError, error, refetch, isRefetching } = useGetRealtime()
	// const {
	// 	data: clustersToRender,
	// 	isLoading: isClustersLoading,
	// 	refetch: refetchClusters,
	// } = useQuery({
	// 	queryFn: async () => getClusteredAsync(data as any, map.current),
	// 	queryKey: [data?.feed],
	// 	enabled: !!map?.current,
	// })
	// const [clusteringDisabled, setClusteringDisabled] = useState(false)
	// const deferred_disable_clustering = useDeferredValue(clusteringDisabled)
	useEffect(() => {
		// refetchClusters()
		props.navigation.setOptions({ title: `${data?.feed.length || 0} buses ${new Date().toISOString().slice(0, 19)}` })
	}, [data])
	if (isError && !(data && data.feed)) {
		return <ErrorPage retry={isRefetching ? () => null : refetch} error={{ description: (error as any).message, title: "Couldn't fetch RT" }} />
	}
	// async function switchClustering() {
	// 	setClusteringDisabled(!clusteringDisabled)
	// }
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
				{/* <SimplyButton
					onPress={() => switchClustering()}
					style={{
						zIndex: 4,
					}}
					size="medium"
					text="clustering"
					color={deferred_disable_clustering ? "red" : "green"}
				/> */}
			</View>
			
				<MapView
					extent={20000}
					nodeSize={1}
					
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
					{data?.feed?.map((e) => {
						return busMarkerFromBus(e as any, props.navigation)
					})}
					{/* {clustersToRender?.entries?.map((val) => {
						if (clustersToRender.isCluster) {
							const value = val as [string, transit_realtime.FeedEntity[]]
							const key = value[0] as string
							const pos = JSON.parse(value[0])

							return <ClusterMarker disable_clustering={deferred_disable_clustering} navigation={props.navigation} key={key} items={value[1]} pos={pos || { latitude: 0, longitude: 0 }} />
						}
						const entity = val as transit_realtime.FeedEntity
						return busMarkerFromBus(entity, props.navigation)
					})} */}
				</MapView>
		</React.Fragment>
	)
}
