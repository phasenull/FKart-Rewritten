import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import BasicRouteInformation from "../../common/interfaces/BasicRouteInformation"
import { Text, TouchableOpacity, View } from "react-native"
import Application from "../../common/Application"
import { useMemo } from "react"

export default function RouteTouchableContainer(props: {
	navigation: NativeStackNavigationProp<any>
	route: any
	item: BasicRouteInformation
}) {
	const { item } = props
	const { navigation } = props
	return useMemo(() => (
		<TouchableOpacity
			onPress={() =>
				navigation.navigate("route_details", { data_route: item })
			}
			className="z-10 py-1 flex-row pl-3 gap-x-2"
		>
			<View
				style={{
					backgroundColor:
						item.routeColor === "006633"
							? Application.styles.primary
							: `#${item.routeColor}`,
					borderRadius: 6,
				}}
				className="my-auto h-6 items-center px-2"
			>
				<Text
					className="text-center my-auto bg-re-400"
					style={{
						color:
							item.routeColor === "006633"
								? Application.styles.secondary
								: `#${item.routeTextColor}`,
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
	),[item])
}
