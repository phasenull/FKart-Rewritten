import { Text, TextProps } from "react-native";
import Application from "../common/Application";

export default function SecondaryText(props:TextProps) {
	return <Text style={[{
		fontWeight:"800",
		color:Application.styles.secondary,
		fontSize:18,
	},props.style]} >
		{props.children}
	</Text>
}