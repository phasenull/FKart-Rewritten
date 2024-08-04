import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useGetRealtime } from "common/hooks/kentkart/nonAuthHooks"
import SecondaryText from "components/reusables/SecondaryText"
import { LegacyRef, useEffect, useMemo, useRef } from "react"
import { View } from "react-native"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"
import ErrorPage from "screens/ErrorPage"
import { BusMarker } from "screens/map_details/markers/BusMarker"

export default function R8R(props: { navigation: NativeStackNavigationProp<any> }) {
	const map = useRef<MapView>()
	const { data, isLoading, isError, error } = useGetRealtime()
	useEffect(()=>{
		props.navigation.setOptions({title:`${data?.feed.length || 0} buses ${new Date().toISOString().slice(0,19)}`})
	},[data])
	return useMemo(() => {
		if (isLoading) {
			return (
				<View>
					<SecondaryText>Loading...</SecondaryText>
				</View>
			)
		}
		if (isError) {
			return <ErrorPage error={{ description: JSON.stringify(error), title: "Couldn't fetch RT" }} />
		}
		return (
			<MapView
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
				{data?.feed?.map((entity) => {
					const vehicle = entity.vehicle as any
					const id = entity.id
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
								timeDiff: Date.now() - parseInt(vehicle.timestamp),
								tripId: vehicle.trip.tripId,
							}}
							key={vehicle.vehicle.licensePlate || id}
							coordinate={{ latitude: vehicle.position.latitude, longitude: vehicle.position.longitude }}
							navigation={props.navigation}
						/>
					)
				})}
			</MapView>
		)
	}, [data, data?.feed])
}
