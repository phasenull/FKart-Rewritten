import IPoint from "./Point";

export default interface BasicStopInformation extends IPoint  {
	"stopId": string,
	"stopName": string,
	"arrival_offset": string,
	"departure_offset": string,
	"routeColor": string, // hex color LIST
	"routeType": string
	"routeTextColor": string
	"routes": string
	"busOnStop": "1" | "0",
	"timeTable": string,
	"dropoffType": never,
	"pickupType": never
}