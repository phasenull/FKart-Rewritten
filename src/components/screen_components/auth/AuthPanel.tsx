import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { LinearGradient } from "expo-linear-gradient"
import { useContext, useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, Switch, Text, TextInput, TouchableOpacity, View } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Application from "../../../common/Application"
import { TranslationsContext } from "../../../common/contexts/TranslationsContext"
import { UserContext } from "../../../common/contexts/UserContext"
import LoginTypes from "../../../common/enums/LoginTypes"
import SecondaryText from "../../root/SecondaryText"
import SwitchAuthPage from "./SwitchAuthPage"
import { ThemeContext } from "../../../common/contexts/ThemeContext"

type AuthPanelProps = { updatePage: (index: number) => void; panel_type: number; navigation: NativeStackNavigationProp<any> }
export default function AuthPanel(props: AuthPanelProps) {
	const [is_keyboard_open, setIsKeyboardOpen] = useState(false)
	const [inputType, setInputType] = useState<LoginTypes>(LoginTypes.phone)
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

	const { isFetching, loggedUser, loginUsingEmail, loginUsingPhone, isError, error } = useContext(UserContext)
	const { translations } = useContext(TranslationsContext)

	const { panel_type, updatePage } = props
	const {theme} = useContext(ThemeContext)
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
					autoComplete={inputType === LoginTypes.email ? "email" : "tel"}
					style={{ color: theme.secondary }}
					placeholderTextColor={theme.secondaryDark}
					inputMode={inputType === LoginTypes.email ? "email" : "tel"}
					placeholder={inputType === LoginTypes.email ? translations.input_fields.email : translations.input_fields.phone}
					className="mt-8 border-2 w-full h-16 border-slate-200 rounded-[10px] px-8 py-2 shadow-2xl"
					value={input_fields[inputType === LoginTypes.email ? "email" : "tel"] || ""}
					onChangeText={(text) => {
						setInputFields({ ...input_fields, [inputType === LoginTypes.email ? "email" : "tel"]: text })
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
						value={inputType === LoginTypes.phone}
						thumbColor={theme.primaryDark}
						onValueChange={(value) => {
							setInputType(value ? LoginTypes.phone : LoginTypes.email)
						}}
					/>
				</View>
				{isError ? <Text style={{ color: theme.error }}>{error}</Text> : null}
			</KeyboardAvoidingView>
			{/* button */}
			{
				// is_keyboard_open
				false ? null : (
					<TouchableOpacity
						onPress={async () => {
							switch (inputType) {
								case LoginTypes.phone:
									if (panel_type === 0) {
										console.log("login", inputType, LoginTypes.phone)
										loginUsingPhone({ password: input_fields.password, username: input_fields.tel })
									}
									break
								case LoginTypes.email:
									if (panel_type === 0) {
										console.log("login", inputType, LoginTypes.email)
										loginUsingEmail({ password: input_fields.password, username: input_fields.email })
									}
									break
							}
						}}
						disabled={isFetching}
						className="right-8 self-end w-max"
						activeOpacity={0.6}
					>
						<LinearGradient
							className="rounded-[16px] px-3"
							start={[0, 0.5]}
							end={[1, 0.5]}
							style={{
								opacity: isFetching ? 0.3 : 1,
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
					props.navigation?.navigate("home", { canGoBack: false })
				}}
			>
				<MaterialCommunityIcons size={48} name="incognito" />
				<SecondaryText>{translations.incognito_mode}</SecondaryText>
			</TouchableOpacity>
		</View>
	)
}
