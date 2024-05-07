import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import SegmentedButtons from "../../root/SegmentedButtons"; 
import Application from "../../../common/Application"; 
import Animated, { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp, SlideInUp, SlideOutUp, StretchInX, ZoomIn, ZoomInUp, ZoomOut, ZoomOutDown, ZoomOutUp } from "react-native-reanimated"

export default function FilterByRouteTypeModal(props: { visible: boolean; setVisible: any; setFilterByRouteType: any; filterByRouteType: any }) {
	const { visible, setVisible, setFilterByRouteType, filterByRouteType } = props
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
				entering={StretchInX.duration(150)}
				exiting={ZoomOut.duration(150)}
				className="absolute w-80 px-4 rounded-[16px] py-5 mt-20 mx-auto items-center justify-center self-center"
				style={{
					backgroundColor: Application.styles.white,
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
