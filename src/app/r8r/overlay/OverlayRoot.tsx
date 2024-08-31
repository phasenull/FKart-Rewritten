import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SimplyButton from "components/ui/SimplyButton";
import { View } from "react-native";

export default function OverlayRoot(props:{
	isRefetchLoading:boolean,
	refetchFn:()=>void,
	navigation:NativeStackNavigationProp<any>
}) {
	return <View className="flex-1 z-10">
		
		<View className="absolute bottom-4 flex flex-row self-center">
				<SimplyButton
					text="refetch"
					size="medium"
					style={{
						zIndex: 4,
					}}
					onPress={props.refetchFn}
					disabled={props.isRefetchLoading}
				/>
			</View>
	</View>
}