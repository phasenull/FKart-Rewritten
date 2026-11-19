import { ThemeContext } from "common/contexts/ThemeContext"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import { openSignIn } from "common/hooks/auth/useRequireAuth"
import { useContext } from "react"
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const STRINGS = {
	en: { title: "Sign in to see this", button: "Sign in" },
	tr: { title: "Bunu görmek için giriş yap", button: "Giriş yap" },
}

/** inline replacement for a section that needs a KentKart account (incognito mode) */
export default function SignInPrompt(props: { title?: string; description?: string; icon?: string; style?: StyleProp<ViewStyle> }) {
	const { theme } = useContext(ThemeContext)
	const { lang } = useContext(TranslationsContext)
	const t = (lang as string) === "tr" ? STRINGS.tr : STRINGS.en
	return (
		<View style={[{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, backgroundColor: theme.white, elevation: 2 }, props.style]}>
			<MaterialCommunityIcons name={props.icon || "account-lock-outline"} size={28} color={theme.secondary} style={{ opacity: 0.5 }} />
			<View style={{ flex: 1 }}>
				<Text style={{ color: theme.secondary, fontWeight: "800", fontSize: 14 }}>{props.title || t.title}</Text>
				{props.description ? <Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "600", fontSize: 12, marginTop: 2 }}>{props.description}</Text> : null}
			</View>
			<TouchableOpacity onPress={openSignIn} style={{ backgroundColor: theme.primary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9 }}>
				<Text style={{ color: theme.secondaryDark, fontWeight: "800", fontSize: 14 }}>{t.button}</Text>
			</TouchableOpacity>
		</View>
	)
}
