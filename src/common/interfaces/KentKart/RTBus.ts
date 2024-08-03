export default interface RTBus {
	id: string
	vehicle: {
		trip: {
			tripId: string
			scheduleRelationship: "SCHEDULED"
			routeId: string
		}
		position: {
			latitude: number
			longitude: number
			bearing: number
			speed: number
		}
		currentStopSequence: 63
		currentStatus: "IN_TRANSIT_TO" | "INCOMING_AT"
		timestamp: string
		congestionLevel: "UNKNOWN_CONGESTION_LEVEL"
		stopId: string
		vehicle: {
			id: string
			label: string
			licensePlate: string
		}
	}
}
