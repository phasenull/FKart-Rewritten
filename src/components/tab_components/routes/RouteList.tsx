import { FlatList, RefreshControl, Text } from "react-native"
import BasicRouteInformation from "common/interfaces/KentKart/BasicRouteInformation" 
import RouteTouchable from "./RouteTouchable"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useContext, useMemo } from "react"
import Application from "common/Application"
import { ThemeContext } from "common/contexts/ThemeContext"
export default function RouteList(props: {
	data: { routeList: BasicRouteInformation[] }
	refreshing: boolean
	onRefresh: () => void
	searchText: string
	route: any
	navigation: NativeStackNavigationProp<any>
	routeType?: string
}) {
	function renderRoute({ index, item }: { index: number; item: BasicRouteInformation }) {
		return <RouteTouchable item={item} navigation={props.navigation} route={props.route} />
	}
	const {theme} = useContext(ThemeContext)
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
				style={{
					backgroundColor:theme.dark,

				}}
				contentContainerStyle={{
					paddingBottom:80
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
