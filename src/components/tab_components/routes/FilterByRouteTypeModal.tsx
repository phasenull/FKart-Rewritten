import { Text, TouchableOpacity,View } from "react-native"
import SegmentedButtons from "components/reusables/SegmentedButtons";
import Animated, { BounceIn, BounceInDown, BounceInLeft, BounceInUp, BounceOut, BounceOutDown, BounceOutRight, StretchInX, ZoomInUp, ZoomOut, ZoomOutDown, ZoomOutUp} from "react-native-reanimated"
import { useContext } from "react";
import { ThemeContext } from "common/contexts/ThemeContext";

export default function FilterByRouteTypeModal(props: { visible: boolean; setVisible: any; setFilterByRouteType: any; filterByRouteType: any }) {
	const { visible, setVisible, setFilterByRouteType, filterByRouteType } = props
	const {theme} = useContext(ThemeContext)

	if (!visible) return null
	return (
		<View style={{ flex: 1, zIndex: 2,top:12*4 }}>
			<TouchableOpacity
				activeOpacity={1}
				style={{
					flex: 1,
					// backgroundColor: "rgba(0,0,0,0.5)",
					justifyContent: "center",
					alignItems: "center",
				}}
				onPress={() => setVisible(false)}
			/>
			<Animated.View
				entering={ZoomInUp.duration(150)}
				exiting={ZoomOutUp.duration(150)}
				className="absolute w-80 px-4 rounded-[16px] py-5 mt-20 mx-auto items-center justify-center self-center"
				style={{
					backgroundColor: theme.white,
					shadowOffset: { height: 4, width: 4 },
				}}
			>
				<Text className="font-bold text-xl mb-5">Filter by Route Type</Text>
				<SegmentedButtons
					onSelect={(item) => {
						setVisible(false)
						setFilterByRouteType(item)
					}}
					defaultKey={filterByRouteType.key}
					values={[
						{
							label: "All",
							key: "all",
							value: undefined,
						},
						{
							label: "Bus",
							key: "bus",
							value: "3",
						},
						{
							label: "Tram",
							key: "tram",
							value: "0",
						},
						{
							label: "Ferry",
							key: "ferry",
							value: "4",
						},
					]}
				/>
				{/* </Animated.View> */}
			</Animated.View>
		</View>
	)
}
