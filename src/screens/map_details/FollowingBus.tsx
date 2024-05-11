import { StyleProp, Text, ViewStyle } from "react-native"
import BusData from "common/interfaces/KentKart/BusData"
import { TouchableOpacity } from "react-native-gesture-handler"
import Animated from "react-native-reanimated"
import { useContext } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"

export default function FollowingBus(props: { onStopFollowing: () => void; bus?: BusData; style?: StyleProp<ViewStyle> }) {
	const { theme } = useContext(ThemeContext)

	if (!props.bus) return null
	return (
		<Animated.View className="flex-row self-center items-center" style={props.style}>
			<Text
				className="mr-2"
				style={{
					fontWeight: "600",
					color: theme.secondary,
					backgroundColor: theme.white,
					paddingHorizontal: 4 * 4,
					paddingVertical: 2 * 4,
					borderRadius: 16,
					elevation: 10,
				}}
			>
				Following bus: {props.bus.plateNumber}
			</Text>
			<TouchableOpacity
				onPress={props.onStopFollowing}
				style={{
					backgroundColor: theme.error,
					paddingHorizontal: 4 * 4,
					paddingVertical: 2 * 4,
					borderRadius: 16,
					elevation: 10,
				}}
			>
				<Text style={{ fontWeight: "600", color: theme.white }}>Stop</Text>
			</TouchableOpacity>
		</Animated.View>
	)
}
