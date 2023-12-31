import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import BasicRouteInformation from "../../common/interfaces/BasicRouteInformation"
import { Text, TouchableOpacity, View } from "react-native"
import Application from "../../common/Application"

export default function RouteTouchableContainer(props: {
	navigation: NativeStackNavigationProp<any>
	route: any
	item: BasicRouteInformation
}) {
	const { item } = props
	const { navigation, route } = props
	return (
		<TouchableOpacity onPress={
			()=>navigation.navigate("route_details", {data_route: item})
		} className="z-10 py-1 flex-row pl-3 gap-x-2">
			<View
				style={{
					backgroundColor: Application.styles.primary,
					borderRadius: 6,
				}}
				className="my-auto h-6 items-center px-2"
			>
				<Text
					className="text-center my-auto bg-re-400"
					style={{
						color: Application.styles.secondary,
						fontWeight: "900",
					}}
				>
					{item.displayRouteCode}
				</Text>
			</View>
			<Text
				style={{
					color: Application.styles.secondary,
					fontWeight: "500",
				}}
			>
				{item.name} ({item.routeCode})
			</Text>
		</TouchableOpacity>
	)
}
