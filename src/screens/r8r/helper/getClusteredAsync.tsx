import { transit_realtime } from "gtfs-realtime-bindings"
import { LegacyRef } from "react"
import MapView from "react-native-maps"
import createClusters from "screens/r8r/helper/ClusterHelper"
export default async function getClusteredAsync(
	data: {
		feed?: transit_realtime.FeedEntity[]
	},
	map?: MapView
) {
	if (!data) {
		console.log("no data")
		return
	}
	let { feed } = data
	if (!feed) {
		console.warn("no feed")
		return
	}
	console.log("cluster hook started")
	if (!map) {
		return
	}
	if (!(feed.length > 3)) {
		console.log(`not enough (any) components (${feed.length}/100)`)
		return { entries: feed, isCluster: false }
	}

	if (!(feed.length > 3)) {
		console.log(`not enough visible components (${feed.length}/20)`)
		return { entries: feed, isCluster: false }
	}
	const clusters = createClusters<any>({
		data: feed,
		maxRadius: 0.05,
		vec2Getter: (e:transit_realtime.FeedEntity) => e.vehicle?.position as any
	}) as any as Record<string, [(typeof feed)[0]]>

	const finalObjects = Object.entries(clusters)
	console.log("finalObjects", finalObjects.length)

	return {
		isCluster: true,
		entries: finalObjects,
	}
}
