import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import BasicRouteInformation from "../../common/interfaces/KentKart/object/BasicRouteInformation"
import { Text, TouchableOpacity, View } from "react-native"
import Application from "../../common/Application"
import { useMemo } from "react"
import Divider from "../Divider"
import Animated from "react-native-reanimated"

export default function RouteTouchableContainer(props: { navigation: NativeStackNavigationProp<any>; route: any; item: BasicRouteInformation }) {
	const { item } = props
	const { navigation } = props

	return useMemo(
		() => (
			
				<TouchableOpacity onPress={() => navigation.navigate("route_details", { data_route: item })} className="py-1 flex-row pl-1">
					<View className="flex-[0.22] my-auto items-center ">
						<View
							className="px-2 h-6"
							h-6
							style={{
								backgroundColor: item.routeColor === "006633" ? Application.styles.primary : `#${item.routeColor}`,
								borderRadius: 6,
							}}
						>
							<Text
								className="text-center my-auto bg-re-400"
								style={{
									color: item.routeColor === "006633" ? Application.styles.secondary : `#${item.routeTextColor}`,
									fontWeight: "900",
								}}
							>
								{item.displayRouteCode}
							</Text>
						</View>
					</View>
					<Divider className="ml-0.5 mr-0.5 self-center" />
					<Text
						className="my-auto ml-1 mr-4 flex-1"
						style={{
							color: Application.styles.secondary,
							fontWeight: "500",
						}}
					>
						{item.name} ({item.routeCode})
					</Text>
				</TouchableOpacity>
		),
		[item]
	)
}
