import { StyleProp, View, ViewStyle } from "react-native"
import Application from "../common/Application"

export default function Divider(props: { style?: StyleProp<ViewStyle> }) {
	const styles = Application.styles
	return <View style={props.style} className="w-full h-1" />
}