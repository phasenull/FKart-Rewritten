import BasicStopInformation from "./BasicStopInformation";
import BusData from "./BusData";
import Point from "./Point";

export default interface RouteData extends Object {
	busList: BusData[]
	busStopList: BasicStopInformation[]
	direction: number
	direction_name: string
	displayRouteCode: string
	headSign: string
	path_code: string
	pointList: Point[]
	scheduleList: any
	stopTimeList: any,
	timeTableList: any
	tripShortName: string
}