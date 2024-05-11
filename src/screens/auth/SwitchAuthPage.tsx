import { useContext } from "react";
import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";
import { ThemeContext } from "common/contexts/ThemeContext";
import { TranslationsContext } from "common/contexts/TranslationsContext";

export default function SwitchAuthPage(props: { style: StyleProp<ViewStyle>; updatePage: (index: number) => void; panel_type: number }) {
	const { updatePage } = props
	const { panel_type } = props
	const { theme } = useContext(ThemeContext)

	const { translations } = useContext(TranslationsContext)

	return (
		<TouchableOpacity
			style={props.style}
			className="z-50 py-6"
			onPress={() => {
				updatePage(1 - panel_type)
			}}
		>
			<Text style={{ textShadowRadius: 3, fontSize: 24 }} className="justify-center text-slate-400 font-extrabold">
				{(props.panel_type ? translations.screens.auth.signup.signin_instead : translations.screens.auth.signin.signup_instead).map((e) =>
					e.mark ? (
						<Text key={e.str} style={{ color: theme.primaryDark }}>
							{e.str}
						</Text>
					) : (
						e.str
					)
				)}
			</Text>
		</TouchableOpacity>
	)
}
