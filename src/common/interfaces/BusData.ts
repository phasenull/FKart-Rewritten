/**
@property {boolean} `ac` air conditioning
@property {number} `bearing` direction of the bus
@property {boolean} `bike` if the bus has a bike rack
@property {string} `busId` the bus id
@property {string} `busLabel` the bus label
@property {string} `couple` the bus couple
@property {boolean} `disabledPerson` if the bus has a accessiblity features
@property {number} `lat` latitude
@property {number} `lng` longitude
@property {boolean} `pickMeUp` ???
@property {string} `plateNumber` license plate (AIG / HO J)
@property {string} `stopId` the stop id
@property {string} `timeDiff` ???
@property {string} `tripId` the trip id
@property {string} `vehicleType` the vehicle type
*/
export default interface BusData {
	ac: "1" | "0"
	bearing: number
	bike: "1" | "0"
	busId: string
	busLabel: string
	couple: string
	disabledPerson: "1" | "0"
	lat: number
	lng: number
	pickMeUp: "1" | "0"
	plateNumber: string
	stopId: string
	timeDiff: never
	tripId: string
	vehicleType: string
}
