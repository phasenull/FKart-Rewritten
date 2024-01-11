import { Modal, Text, TouchableOpacity, View } from "react-native"
import SegmentedButtons from "../SegmentedButtons"
import Application from "../../common/Application"

export default function FilterByRouteTypeModal(props : {
	visible: boolean
	setVisible: any
	setFilterByRouteType: any
	filterByRouteType: any

}) {
	const { visible, setVisible, setFilterByRouteType, filterByRouteType } = props
	if (!visible) return null
	return (<Modal
		transparent={true}
		onDismiss={() => {
			setVisible(false)
		}}
	>
		{/* semi transparent shadow */}
		{/* note: for some reason Feedbackless component throws an error and
		i have no idea why, so instead i fould a *real* solution like a pro programmer 😎 */}
		<TouchableOpacity
			activeOpacity={0.5}
			onPress={() => {
				setVisible(false)
			}}
			className="h-full w-full absolute"
			style={{ backgroundColor: "black", opacity: 0.5 }}
		/>
		<View
			className="w-80 px-4 rounded-[16px] py-5 my-auto items-center justify-center self-center"
			style={{
				backgroundColor: Application.styles.white,
				elevation: 10,
				shadowOffset: { height: 4, width: 4 },
				zIndex: 100,
			}}
		>
			<Text className="font-bold text-xl mb-5">
				Filter by Route Type
			</Text>
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
		</View>
	</Modal>)
}
