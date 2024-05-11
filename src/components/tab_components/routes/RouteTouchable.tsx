import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import BasicRouteInformation from "common/interfaces/KentKart/BasicRouteInformation"
import { Text, TouchableOpacity, View } from "react-native"
import { useContext, useMemo } from "react"
import Divider from "components/root/Divider" 
import { ThemeContext } from "common/contexts/ThemeContext"

export default function RouteTouchable(props: { navigation: NativeStackNavigationProp<any>; route: any; item: BasicRouteInformation }) {
	const { item } = props
	const { navigation } = props
	const {theme} = useContext(ThemeContext)
	return useMemo(
		() => (
			<TouchableOpacity
				onPress={() => {
					navigation.push("route_details", { data_route: item })
				}}
				className="py-1 flex-row pl-1"
			>
				<View className="flex-[0.22] my-auto items-center ">
					<View
						className="px-2 h-6"
						style={{
							backgroundColor: item.routeColor === "006633" ? theme.primary : `#${item.routeColor}`,
							borderRadius: 6,
						}}
					>
						<Text
							className="text-center my-auto"
							style={{
								color: item.routeColor === "006633" ? theme.secondary : `#${item.routeTextColor}`,
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
						color: theme.secondary,
						fontWeight: "500",
					}}
				>
					{item.name} ({item.routeCode})
				</Text>
			</TouchableOpacity>
		),
		[item,theme]
	)
}
