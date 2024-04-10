import BasicStopInformation from "./BasicStopInformation"
import BusData from "./BusData"
import IPoint from "./Point"

export default interface RouteData extends Object {
	busList: BusData[]
	busStopList: BasicStopInformation[]
	direction: number
	direction_name: string
	displayRouteCode: string
	headSign: string
	path_code: string
	pointList: IPoint[]
	scheduleList: any
	stopTimeList: any
	timeTableList: {
		departureTime: string
		wheelChairId: "0"
		tripId: string
		patternColor: string
		tripHeadSign: string
	}[]
	tripShortName: string
}
