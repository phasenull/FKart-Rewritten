import { ActivityIndicator, ColorValue, StyleProp, ViewStyle } from "react-native";
import Application from "../common/Application";

export default function CustomLoadingIndicator(props: {style?:StyleProp<ViewStyle>,color?:ColorValue,size?:number | "small" | "large" }) {
	return <ActivityIndicator
		className="scale-150"
		size={props.size || "large"}
		style={props.style}
		color={props.color || Application.styles.primary}
	/>
}
