import { ThemeContext } from "common/contexts/ThemeContext"
import BasicRouteInformation from "common/interfaces/KentKart/BasicRouteInformation"
import Divider from "components/reusables/Divider"
import { router } from "expo-router"
import { useContext, useMemo } from "react"
import { Text, TouchableOpacity, View } from "react-native"

export default function RouteTouchable(props: { item: BasicRouteInformation }) {
	const { item } = props

	const { theme } = useContext(ThemeContext)

	return useMemo(() => {
		return (
			<TouchableOpacity
				onPress={() => {
					router.push({pathname:`/route_details/[route_code]`,params:{headerTitle:item.name,route_code: item.displayRouteCode}})
				}}
				className="py-1 flex-row pl-1"
			>
				<View className="flex-[0.22] my-auto items-center ">
					<View
						className="px-2 h-6"
						style={{
							backgroundColor: item.routeColor === "006633" ? theme.primary : `#${item.routeColor || "fff"}`,
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
		)
	}, [item, theme])
}
