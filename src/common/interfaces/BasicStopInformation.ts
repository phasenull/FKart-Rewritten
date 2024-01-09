import Point from "./Point";

export default interface BasicStopInformation extends Point  {
	"stopId": string,
	"stopName": string,
	"arrival_offset": number,
	"departure_offset": number,
	"routeColor": string, // hex color LIST
	"routeType": string
	"routeTextColor": string
	"routes": string
	"busOnStop": number | boolean,
	"timeTable": string,
	"dropoffType": never,
	"pickupType": never
}