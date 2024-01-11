import { FlatList, RefreshControl } from "react-native"
import BasicRouteInformation from "../../common/interfaces/BasicRouteInformation"
import RouteTouchableContainer from "./RouteTouchableContainer"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useMemo } from "react"
export default function RouteList(props: {
	data: { routeList: BasicRouteInformation[] }
	refreshing: boolean
	onRefresh: () => void
	searchText: string
	route: any
	navigation: NativeStackNavigationProp<any>
}) {
	function renderRoute({
		index,
		item,
	}: {
		index: number
		item: BasicRouteInformation
	}) {
		return (
			<RouteTouchableContainer
				item={item}
				navigation={props.navigation}
				route={props.route}
			/>
		)
	}
	const { data, refreshing, onRefresh, searchText } = props
	const finalData = useMemo(() => {
		if (!searchText || searchText === "") {return data.routeList?.slice(0, 25)}
		return data.routeList
			?.filter((item: BasicRouteInformation) => {
				return (
					item.displayRouteCode.toLowerCase().startsWith(searchText.toLowerCase()) ||
					item.displayRouteCode.toLowerCase() ===
						searchText.toLocaleLowerCase() ||
					item.name.toLowerCase().includes(searchText.toLowerCase())
				)
			})
			.slice(0, 25)
	}, [searchText, data])
	return (
		<FlatList
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>
			}
			className="z-10 mt-20 mb-20"
			// contentContainerStyle={{ paddingTop: 60 }}
			maxToRenderPerBatch={10}
			
			data={finalData}
			renderItem={renderRoute}
		/>
	)
}
