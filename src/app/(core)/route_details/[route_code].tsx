// The route page and the map page are one screen now (map + bus sheet).
// map_details reads `route_code` as well as `force_route_code`.
import MapData from "../map_details"

export default function RouteDetails() {
	return <MapData />
}
