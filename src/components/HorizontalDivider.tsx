import { StyleProp, View, ViewStyle } from "react-native"

export default function HorizontalDivider(props : {
	style?: StyleProp<ViewStyle>
}) {
	return <View style={props.style} className="w-full h-1" />
}