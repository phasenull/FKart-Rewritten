import SimplyButton from "components/ui/SimplyButton"
import { View } from "react-native"

export default function OverlayRoot(props: { isRefetchLoading: boolean; refetchFn: () => void }) {
	return (
		<>
			{/* buttons */}
			<View className="z-50 absolute bottom-12 self-center ">
				<SimplyButton
					text="refetch"
					size="medium"
					style={{
						width:24*4,
					}}
					onPress={props.refetchFn}
					disabled={props.isRefetchLoading}
				/>
			</View>
		</>
	)
}
