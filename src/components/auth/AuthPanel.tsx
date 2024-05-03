import { Animated, Keyboard, KeyboardAvoidingView, Platform, Switch, SwitchComponent, Text, TextInput, TouchableOpacity, View } from "react-native"
import Application from "../../common/Application"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import LoginTypes from "../../common/enums/LoginTypes"
import { Component, ReactNode, useContext, useState } from "react"
import SwitchAuthPage from "./SwitchAuthPage"
import { withTiming } from "react-native-reanimated"
import Logger from "../../common/Logger"
import { UserContext, UserContextProvider } from "../../common/contexts/UserContext"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
type AuthPanelProps = { updatePage: (index: number) => void; panel_type: number,navigation:NativeStackNavigationProp<any> }
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

	const { isFetching, loggedUser, loginUsingEmail, loginUsingPhone,isError,error } = useContext(UserContext)
	Logger.info(`UserContext: isFetching-${isFetching} loggedUser-${loggedUser?.name}`)
	if (loggedUser) {
		console.log("user is already logged in, redirecting to home!")
		props.navigation.replace("home",{user:loggedUser})
		return
	}
	const { panel_type, updatePage } = props
	const styles = Application.styles
	const theme = Application.theme
	return (
		<View style={{ backgroundColor: styles.white }} className="h-full py-4 flex-1 items-center justify-evenly w-1/2">
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} className="flex mb-4 mt-12 flex-col mx-auto justify-center h-64 w-64">
				<Text style={{ color: styles.secondaryDark }} className="text-4xl text-left font-bold">
					{panel_type === 0 ? "Sign In" : "Sign Up"}
				</Text>
				<Text style={{ color: styles.secondaryDark }} className="text-lg opacity-50 font-bold">
					{panel_type === 0 ? "Welcome Back!" : "Welcome!"}
				</Text>
				{/* username */}
				<TextInput
					autoComplete={inputType === LoginTypes.email ? "email" : "tel"}
					style={{ color: styles.secondary }}
					placeholderTextColor={styles.secondaryDark}
					inputMode={inputType === LoginTypes.email ? "email" : "tel"}
					placeholder={inputType === LoginTypes.email ? "E-Mail" : "Phone Number"}
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
					style={{ color: styles.secondary }}
					placeholderTextColor={styles.secondaryDark}
					passwordRules={"minlength: 8; required: true;"}
					placeholder={"Password"}
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
						style={{ color: styles.secondary }}
						placeholderTextColor={styles.secondaryDark}
						passwordRules={"minlength: 8; required: true;"}
						placeholder={"Password"}
						className="mt-8 border-2 w-full h-16 border-slate-200 rounded-[10px] px-8 py-2 shadow-2xl"
						value={input_fields.confirm_password || ""}
						onChangeText={(text) => {
							setInputFields({ ...input_fields, ["confirm_password"]: text })
						}}
					/>
				) : null}
				<View className="flex flex-row items-center align-middle justify-end -mt-2">
					<Text style={{ color: styles.secondaryDark }}>Use a phone number</Text>
					<Switch
						value={inputType === LoginTypes.phone}
						thumbColor={styles.primaryDark}
						onValueChange={(value) => {
							setInputType(value ? LoginTypes.phone : LoginTypes.email)
						}}
					/>
				</View>
				{isError? <Text style={{ color: styles.warning }}>
					{error}
				</Text> : null}
			</KeyboardAvoidingView>
			{/* button */}
			{is_keyboard_open ? null : (
				<TouchableOpacity
					onPress={async () => {
						switch (inputType) {
							case LoginTypes.phone:
								if (panel_type === 0) {
									console.log("login",inputType, LoginTypes.phone)
									loginUsingPhone({password:input_fields.password,username:input_fields.tel})
								}
								break
							case LoginTypes.email:
								console.log(inputType, LoginTypes.email)
								alert("not implemented yet")
								break
						}
					}}
					className="mt-8 mb-32 -mr-44 w-max"
					activeOpacity={0.6}
				>
					<LinearGradient className="rounded-[16px] px-3" start={[0, 0.5]} end={[1, 0.5]} colors={[styles.primary, styles.primaryDark]}>
						<Text style={{ color: styles.white }} className="text-2xl text-center font-bold pl-5 pr-2 py-3">
							{panel_type === 0 ? "Sign In" : "Sign Up"}
							{"    ➜"}
						</Text>
					</LinearGradient>
				</TouchableOpacity>
			)}
			<SwitchAuthPage style={{ marginBottom: is_keyboard_open ? 4 * 4 : 12 * 4 }} updatePage={updatePage} panel_type={panel_type} />
		</View>
	)
}
async function HandleForm(params: { callback: Function; form_type: number; type: LoginTypes; email: string; password: string; confirm_password: string; tel: string }) {
	const { type, email, password, confirm_password, tel, form_type } = params
	// WHAT HAVE I DONE
	switch (form_type) {
		default: {
			if (!password) {
				alert("Please fill out all fields")
				return
			}
			if (password.length < 6) {
				alert("Password must be at least 8 characters long")
				return
			}
		}
		case 0:
			// sign in
			if (type === LoginTypes.email) {
				if (!(email && password)) {
					alert("Please fill out all fields")
					return
				}
			}
			if (type === LoginTypes.phone) {
				if (!(tel && password)) {
					alert("Please fill out all fields")
					return
				}
				if (type === LoginTypes.phone) {
					if (tel.length < 10) {
						alert("Phone number must be at least 10 digits long")
						return
					}
				}
			}
			const response = await Application.login({ auth_type: type, auth_value: email || tel, password: password })
			if (!response) {
				alert("Invalid credentials")
				return
			}
			if (response) {
				alert("Logged in")
				params.callback(response)
			}
			break
		case 1:
			// sign up

			if (type === LoginTypes.email) {
				if (!(email && password && confirm_password)) {
					alert("Please fill out all fields")
					return
				}
			}
			if (type === LoginTypes.phone) {
				if (!(tel && password && confirm_password)) {
					alert("Please fill out all fields")
					return
				}
				if (type === LoginTypes.phone) {
					if (tel.length < 10) {
						alert("Phone number must be at least 10 digits long")
						return
					}
				}
			}
			if (type === LoginTypes.email) {
				if (password !== confirm_password) {
					alert("Passwords do not match")
					return
				}
			}
			break
	}
}
