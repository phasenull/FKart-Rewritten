import { StyleProp, Text, View, ViewStyle } from "react-native"
import BusData from "../../../common/interfaces/KentKart/object/BusData"
import { TouchableOpacity } from "react-native-gesture-handler"
import Application from "../../../common/Application"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import Animated from "react-native-reanimated"

export default function FollowingBus(props: { onStopFollowing: () => void; bus?: BusData; style?: StyleProp<ViewStyle> }) {
	if (!props.bus) return null
	return (
		<Animated.View className="flex-row self-center items-center" style={props.style}>
			<Text
				className="mr-2"
				style={{
					fontWeight: "600",
					color: Application.styles.secondary,
					backgroundColor: Application.styles.white,
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
					backgroundColor: Application.styles.warning,
					paddingHorizontal: 4 * 4,
					paddingVertical: 2 * 4,
					borderRadius: 16,
					elevation: 10,
				}}
			>
				<Text style={{ fontWeight: "600", color: Application.styles.white }}>Stop</Text>
			</TouchableOpacity>
		</Animated.View>
	)
}
