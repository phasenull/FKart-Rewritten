import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import SecondaryText from "components/reusables/SecondaryText"
import { transit_realtime } from "gtfs-realtime-bindings"
import React, { useDeferredValue, useState } from "react"
import { Text, View } from "react-native"
import { Camera, Circle, LatLng, Marker, Point } from "react-native-maps"
import { BusMarker } from "screens/map_details/markers/BusMarker"
function avgFromArray(arr: number[]) {
	let total = 0
	arr.forEach((element) => {
		total += element
	})
	return total / arr.length
}
function getAvgPositionFromArray(data: transit_realtime.FeedEntity[]): LatLng {
	const long = data.map((e) => e.vehicle?.position?.longitude as number)
	const lat = data.map((e) => e.vehicle?.position?.latitude as number)
	return { latitude: avgFromArray(lat), longitude: avgFromArray(long) }
}
export function busMarkerFromBus(entity: transit_realtime.FeedEntity, navigation: NativeStackNavigationProp<any>) {
	const id = entity.id
	const vehicle = entity.vehicle as any
	const [bus_id, disabled_person, _3, _4, vehicle_type, _5, _6, pick_me_up] = vehicle.vehicle.id.split("|")
	return (
		<BusMarker
			is_rt={true}
			route_data={{
				displayRouteCode: vehicle.trip.routeId,
				direction_name: vehicle.vehicle.label,
				headSign: vehicle.vehicle.label,
				busList: [],
				busStopList: [],
				direction: 0,
				path_code: vehicle.trip.routeId,
				pointList: [],
				scheduleList: [],
				stopTimeList: [],
				timeTableList: [],
				tripShortName: vehicle.vehicle.label,
			}}
			bus={{
				busLabel: vehicle.vehicle.label,
				plateNumber: vehicle.vehicle.licensePlate,
				busId: bus_id,
				bearing: vehicle.position.bearing.toString(),
				lat: vehicle.position.latitude.toString(),
				lng: vehicle.position.longitude.toString(),
				vehicleType: vehicle_type,
				ac: "0",
				bike: "0",
				couple: "",
				disabledPerson: disabled_person.toString() as any,
				pickMeUp: pick_me_up.toString() as any,
				seq: vehicle.currentStopSequence.toString(),
				stopId: vehicle.stopId,
				timeDiff: parseInt(vehicle.timestamp),
				tripId: vehicle.trip.tripId,
			}}
			key={vehicle.vehicle.licensePlate || id}
			coordinate={{ latitude: vehicle.position.latitude, longitude: vehicle.position.longitude }}
			navigation={navigation}
		/>
	)
}
export default function ClusterMarker(props: {disable_clustering?:boolean, items: transit_realtime.FeedEntity[]; pos: LatLng; navigation: NativeStackNavigationProp<any> }) {
	const [showFull, setShowFull] = useState(false)
	if (props.items.length <= 3 || props.disable_clustering) {
		return <React.Fragment>{props.items.map((e) => busMarkerFromBus(e, props.navigation))}</React.Fragment>
	}
	return (
		<Marker
			onPress={() => setShowFull(!showFull)}
			anchor={{
				x: 0.5,
				y: 0.5,
			}}
			tracksViewChanges={false}
			coordinate={getAvgPositionFromArray(props.items)}
		>
			<View
				style={{
					// borderRadius: 10000,
					// backgroundColor: "red",
					width: Math.min(80, 10 + props.items?.length * 3),
					height: Math.min(80, 10 + props.items?.length * 3),
					opacity: 0.5,
					borderRadius: 1000,
					aspectRatio: 1,
					backgroundColor: showFull ? "orange" : "cyan",
				}}
				className="justify-center items-center bg-opacity-20"
			>
				{showFull ? null : null}
				<SecondaryText adjustsFontSizeToFit={true} style={{ fontSize: 80 }}>
					{props.items.length || "?"}
				</SecondaryText>
			</View>
		</Marker>
	)
}
