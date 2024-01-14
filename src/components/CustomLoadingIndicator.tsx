import { ActivityIndicator, ColorValue, StyleProp, ViewStyle } from "react-native";
import Application from "../common/Application";

export default function CustomLoadingIndicator(props: {style?:StyleProp<ViewStyle>,color?:ColorValue}) {
	return <ActivityIndicator
		className="mx-auto my-auto scale-150"
		size="large"
		style={props.style}
		color={props.color || Application.styles.primary}
	/>
}
