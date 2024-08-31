import { LatLng } from "react-native-maps"

function groupBy(data: any[], keyGetter: (e: any) => string) {
	const grouped: Record<string, any[]> = {}
	data.forEach((e) => {
		const key = keyGetter(e)
		if (grouped[key]) {
			// console.log("gr",grouped)
			grouped[key].push(e)
		} else {
			grouped[key] = [e]
		}
	})
	// console.log(Object.keys(grouped))
	return grouped
}
export default function createClusters<T>(args: { data: T[]; maxRadius: number; vec2Getter: (e: T) => LatLng }) {
	let { vec2Getter, data,maxRadius } = args
	console.log("create clusters has been called!!!", maxRadius)
	const clusters = groupBy(data, (item: T) => {
		const {latitude,longitude} = vec2Getter(item)
		const grid_key = {
			longitude: Math.floor(longitude / maxRadius) * maxRadius,
			latitude: Math.floor(latitude / maxRadius) * maxRadius,
		}
		return JSON.stringify(grid_key)
	})
	return clusters
}
