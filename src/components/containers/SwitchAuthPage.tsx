import { RegisteredStyle, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import Application from "../../common/Application"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

export default function SwitchAuthPage(props: { style:StyleProp<ViewStyle>, updatePage: (index: number) => void; panel_type: number }) {
	const { updatePage } = props
	const { panel_type } = props
	const styles = Application.styles
	return (
		<TouchableOpacity
			style={props.style }
			className="z-50 absolute bottom-0"
			onPress={() => {
				updatePage(1 - panel_type)
			}}
		>
			<Text style={{ textShadowRadius: 3}} className="justify-center text-slate-400 text-lg font-extrabold">
				{props.panel_type === 0 ? "Don't have an account?" : "Already have an account?"}
				<Text style={{ color: styles.primaryDark }}>{props.panel_type === 0 ? " Sign Up" : " Sign In"}</Text>
			</Text>
		</TouchableOpacity>
	)
}
