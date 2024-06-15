import { ActivityIndicator, ColorValue, StyleProp, ViewStyle } from "react-native";
import ApplicationConfig from "common/ApplicationConfig";
import { useContext } from "react";
import { ThemeContext } from "common/contexts/ThemeContext";

export default function CustomLoadingIndicator(props: {style?:StyleProp<ViewStyle>,color?:ColorValue,size?:number | "small" | "large" }) {
	const {theme} = useContext(ThemeContext)
	return <ActivityIndicator
		className="scale-150"
		size={props.size || "large"}
		style={props.style}
		color={props.color || theme.primary}
	/>
}
