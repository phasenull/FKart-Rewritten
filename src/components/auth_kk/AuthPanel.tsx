import { ThemeContext } from "common/contexts/ThemeContext"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import AuthTypes from "common/enums/LoginTypes"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import SecondaryText from "components/reusables/SecondaryText"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useContext, useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, Switch, Text, TextInput, TouchableOpacity, View } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import SwitchAuthPage from "./SwitchAuthPage"

type AuthPanelProps = { updatePage: (index: number) => void; panel_type: number; }
export default function AuthPanel(props: AuthPanelProps) {
	const [is_keyboard_open, setIsKeyboardOpen] = useState(false)
	const [inputType, setInputType] = useState<AuthTypes>(AuthTypes.phone)
	const [input_fields, setInputFields] = useState<{ confirm_password: string; email: string; password: string; tel: string }>({
		email: "",
		password: "",
		confirm_password: "",
		tel: "",
	})
	const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
		setIsKeyboardOpen(true)
	})
	const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
		setIsKeyboardOpen(false)
	})

	const { user, login } = useKentKartAuthStore((state) => state)
	const { translations } = useContext(TranslationsContext)
	const [error,setError] = useState<undefined | string>(undefined)
	const { panel_type, updatePage } = props
	const { theme } = useContext(ThemeContext)
	return (
		<View style={{ backgroundColor: theme.white }} className="py-4 flex-1 flex-col items-center justify-evenly w-1/2">
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} className="mb-4 mt-12 flex-col mx-auto justify-center w-64">
				<Text style={{ color: theme.secondaryDark }} className="text-4xl text-left font-bold">
					{panel_type === 0 ? translations.signin : translations.signup}
				</Text>
				<Text style={{ color: theme.secondaryDark }} className="text-lg opacity-50 font-bold">
					{panel_type === 0 ? translations.screens.auth.signin.hello : translations.screens.auth.signup.hello}
				</Text>
				{/* username */}
				<TextInput
					autoComplete={inputType === AuthTypes.email ? "email" : "tel"}
					style={{ color: theme.secondary }}
					placeholderTextColor={theme.secondaryDark}
					inputMode={inputType === AuthTypes.email ? "email" : "tel"}
					placeholder={inputType === AuthTypes.email ? translations.input_fields.email : translations.input_fields.phone}
					className="mt-8 border-2 w-full h-16 border-slate-200 rounded-[10px] px-8 py-2 shadow-2xl"
					value={input_fields[inputType === AuthTypes.email ? "email" : "tel"] || ""}
					onChangeText={(text) => {
						setInputFields({ ...input_fields, [inputType === AuthTypes.email ? "email" : "tel"]: text })
					}}
				/>
				{/* password */}
				<TextInput
					inputMode="text"
					autoComplete={"password"}
					secureTextEntry={true}
					style={{ color: theme.secondary }}
					placeholderTextColor={theme.secondaryDark}
					passwordRules={"minlength: 8; required: true;"}
					placeholder={translations.input_fields.password}
					className="mt-8 border-2 w-full h-16 border-slate-200 rounded-[10px] px-8 py-2 shadow-2xl"
					value={input_fields.password || ""}
					onChangeText={(text) => {
						setInputFields({ ...input_fields, ["password"]: text })
					}}
				/>
				{/* confirm password */}

				{props.panel_type === 1 ? (
					<TextInput
						inputMode="text"
						autoComplete={"password"}
						secureTextEntry={true}
						style={{ color: theme.secondary }}
						placeholderTextColor={theme.secondaryDark}
						passwordRules={"minlength: 8; required: true;"}
						placeholder={translations.input_fields.confirm_password}
						className="mt-8 border-2 w-full h-16 border-slate-200 rounded-[10px] px-8 py-2 shadow-2xl"
						value={input_fields.confirm_password || ""}
						onChangeText={(text) => {
							setInputFields({ ...input_fields, ["confirm_password"]: text })
						}}
					/>
				) : null}
				<View className="flex flex-row items-center align-middle justify-end -mt-2">
					<Text style={{ color: theme.secondaryDark }}>{translations.input_fields.use_phone}</Text>
					<Switch
						value={inputType === AuthTypes.phone}
						thumbColor={theme.primaryDark}
						onValueChange={(value) => {
							setInputType(value ? AuthTypes.phone : AuthTypes.email)
						}}
					/>
				</View>
				{error ? <Text style={{ color: theme.error }}>{error}</Text> : null}
			</KeyboardAvoidingView>
			{/* button */}
			{
				// is_keyboard_open
				false ? null : (
					<TouchableOpacity
						onPress={async () => {
							switch (inputType) {
								case AuthTypes.phone:
									if (panel_type === 0) {
										console.log("login", inputType, AuthTypes.phone)
										const [success,errorstring] = await login({ password: input_fields.password, username: input_fields.tel, auth_type: AuthTypes.phone })
										if (!success) setError(errorstring || "unknown error")

									}
									break
								case AuthTypes.email:
									if (panel_type === 0) {
										console.log("login", inputType, AuthTypes.email)
										const [success,errorstring] = await login({ password: input_fields.password, username: input_fields.email, auth_type: AuthTypes.email })
										if (!success) setError(errorstring || "unknown error")
									}
									break
							}
						}}
						disabled={false}
						className="right-8 self-end w-max"
						activeOpacity={0.6}
					>
						<LinearGradient
							className="rounded-[16px] px-3"
							start={[0, 0.5]}
							end={[1, 0.5]}
							style={{
								opacity: false ? 0.3 : 1,
							}}
							colors={[theme.primary, theme.primaryDark]}
						>
							<Text style={{ color: theme.white }} className="text-2xl text-center font-bold pl-5 px-2 py-3">
								{panel_type === 0 ? translations.signin : translations.signup}
								{/* {"    ➜"} */}
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				)
			}
			<SwitchAuthPage style={{ marginBottom: is_keyboard_open ? 4 * 4 : 12 * 4 }} updatePage={updatePage} panel_type={panel_type} />
			<TouchableOpacity
				className="py-4 opacity-30 items-center"
				onPress={() => {
					router.replace({pathname:"/RootScreen"})
				}}
			>
				<MaterialCommunityIcons size={48} name="incognito" />
				<SecondaryText>{translations.incognito_mode}</SecondaryText>
			</TouchableOpacity>
		</View>
	)
}
