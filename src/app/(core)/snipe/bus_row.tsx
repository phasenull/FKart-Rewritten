import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetLatestBusInfo } from "common/hooks/kk-vts/hooks"
import { deltaTime } from "common/util"
import SecondaryText from "components/reusables/SecondaryText"
import { useContext } from "react"
import { TouchableOpacity } from "react-native"
import { useQuery } from "react-query"

export default function BusRow(props: {bus_data:any}) {
	const { bus_data } = props
	const { theme } = useContext(ThemeContext)
	if (!bus_data ||!bus_data.vehicles) return
	// const { data, isLoading } = useGetLatestBusInfo(bus_data.vehicles.id.toString())
	return <TouchableOpacity onPress={()=>alert(JSON.stringify(bus_data,undefined,4))} className="flex-row" key={bus_data.vehicles?.id}>
		<SecondaryText className="flex flex-[0.6] bg-red-400" numberOfLines={1}>
			{bus_data.vehicles.license_plate}
		</SecondaryText>
		<SecondaryText className="flex-1 bg-blue-400 items-end ">
			{bus_data.trips?.display_route_code||bus_data?.trips?.route_id||bus_data?.vts?.trip_route_id||"???"}
		</SecondaryText>
		<SecondaryText className="flex-1 content-end" style={{ color: deltaTime(Date.now() - new Date(bus_data.vehicles?.last_seen)?.getTime()) == "now" ? theme.success : theme.secondary }}>
			{deltaTime(Date.now() - new Date(bus_data.vehicles?.last_seen)?.getTime())}
		</SecondaryText>
	</TouchableOpacity>
}