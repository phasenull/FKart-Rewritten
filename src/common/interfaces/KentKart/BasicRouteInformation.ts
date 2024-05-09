/**
 * @property {string} routeType - The type of route. 3 = Bus, 0 = Tram, 4 = Ferry
 */
export default interface BasicRouteInformation {
	displayRouteCode: string
	name: string
	routeCode: string
	routeColor: string
	routeTextColor: string
	routeType: string
	slang:never
}
