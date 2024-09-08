import { ThemeContext } from "common/contexts/ThemeContext"
import BasicRouteInformation from "common/interfaces/KentKart/BasicRouteInformation"
import { useContext, useMemo } from "react"
import { FlatList, RefreshControl, Text } from "react-native"
import RouteTouchable from "./RouteTouchable"
export default function RouteList(props: {
	data: { routeList: BasicRouteInformation[] }
	refreshing: boolean
	onRefresh: () => void
	searchText: string
	routeType?: string
}) {
	function renderRoute({ index, item }: { index: number; item: BasicRouteInformation }) {
		return <RouteTouchable item={item}  />
	}
	const { theme } = useContext(ThemeContext)
	const { routeType } = props
	const { data, refreshing, onRefresh, searchText } = props

	const busListFromMemo = useMemo(() => {
		return data.routeList?.filter((item: BasicRouteInformation) => item.routeType === "3")
	}, [])
	const tramListFromMemo = useMemo(() => {
		return data.routeList?.filter((item: BasicRouteInformation) => item.routeType === "0")
	}, [])
	const ferryListFromMemo = useMemo(() => {
		return data.routeList?.filter((item: BasicRouteInformation) => item.routeType === "4")
	}, [])
	function getListFromRouteType(routeType: string | undefined) {
		switch (routeType) {
			case "3":
				return busListFromMemo
			case "0":
				return tramListFromMemo
			case "4":
				return ferryListFromMemo
			default:
				return data.routeList
		}
	}
	const finalData = useMemo(() => {
		if (routeType && (!searchText || searchText === "")) {
			return getListFromRouteType(routeType)
		}
		return getListFromRouteType(routeType)?.filter((item: BasicRouteInformation) => {
			return (
				item.displayRouteCode.toLowerCase().startsWith(searchText.toLowerCase()) ||
				item.displayRouteCode.toLowerCase() === searchText.toLocaleLowerCase() ||
				item.name.toLowerCase().includes(searchText.toLowerCase())
			)
		})
	}, [searchText, routeType])
	return useMemo(
		() => (
			<FlatList
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
				ListEmptyComponent={() => (
					<Text className="text-xl mx-auto mt-5 font-bold" style={{ color: theme.secondary }}>
						No data found!
					</Text>
				)}
				horizontal={false}
				decelerationRate={"fast"}
				
				style={{
					backgroundColor: theme.dark,
				}}
				contentContainerStyle={{
					paddingBottom: 160,
				}}
				// contentContainerStyle={{ paddingTop: 60 }}
				maxToRenderPerBatch={10}
				data={finalData}
				renderItem={renderRoute}
			/>
		),
		[searchText, routeType]
	)
}
