import { Animated, Keyboard, KeyboardAvoidingView, Platform, Switch, SwitchComponent, Text, TextInput, TouchableOpacity, View } from "react-native"
import Application from "../util/Application"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import LoginTypes from "../enums/LoginTypes"
import { Component, ReactNode, useState } from "react"
import SwitchAuthPage from "./rare/SwitchAuthPage"
import { withTiming } from "react-native-reanimated"
import Logger from "../util/Logger"
type AuthPanelProps = {callBack:Function, updatePage: (index: number) => void; panel_type: number }
export default class AuthPanel extends Component<AuthPanelProps> {
	state: { is_keyboard_open?: boolean; input_type: LoginTypes; input_fields: { confirm_password: string; email: string; password: string; tel: string } }

	constructor(props: AuthPanelProps) {
		super(props)
		const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
			this.setState({ is_keyboard_open: true })
		})
		const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
			this.setState({ is_keyboard_open: false })
		})
		this.state = {
			input_type: LoginTypes.phone,
			input_fields: {
				email: "",
				password: "",
				confirm_password: "",
				tel: "",
			},
		}
	}

	setInputType = (type: LoginTypes) => {
		this.setState({ input_type: type })
	}
	render(): ReactNode {
		Logger.log("AuthPanel.render", "rendering" + this.state.is_keyboard_open)
		const { panel_type, updatePage } = this.props
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
						autoComplete={this.state.input_type === LoginTypes.email ? "email" : "tel"}
						style={{ color: styles.dark }}
						placeholderTextColor={styles.secondaryDark}
						inputMode={this.state.input_type === LoginTypes.email ? "email" : "tel"}
						placeholder={this.state.input_type === LoginTypes.email ? "E-Mail" : "Phone Number"}
						className="mt-8 border-2 w-full h-16 border-slate-200 rounded-[10px] px-8 py-2 shadow-2xl"
						value={this.state.input_fields[this.state.input_type === LoginTypes.email ? "email" : "tel"] || ""}
						onChangeText={(text) => {
							this.setState({ input_fields: { ...this.state.input_fields, [this.state.input_type === LoginTypes.email ? "email" : "tel"]: text } })
						}}
					/>
					{/* password */}
					<TextInput
						inputMode="text"
						autoComplete={"password"}
						secureTextEntry={true}
						style={{ color: styles.dark }}
						placeholderTextColor={styles.secondaryDark}
						passwordRules={"minlength: 8; required: true;"}
						placeholder={"Password"}
						className="mt-8 border-2 w-full h-16 border-slate-200 rounded-[10px] px-8 py-2 shadow-2xl"
						value={this.state.input_fields.password || ""}
						onChangeText={(text) => {
							this.setState({ input_fields: { ...this.state.input_fields, ["password"]: text } })
						}}
					/>
					{/* confirm password */}

					{this.props.panel_type === 1 ? (
						<TextInput
							inputMode="text"
							autoComplete={"password"}
							secureTextEntry={true}
							style={{ color: styles.dark }}
							placeholderTextColor={styles.secondaryDark}
							passwordRules={"minlength: 8; required: true;"}
							placeholder={"Password"}
							className="mt-8 border-2 w-full h-16 border-slate-200 rounded-[10px] px-8 py-2 shadow-2xl"
							value={this.state.input_fields.confirm_password || ""}
							onChangeText={(text) => {
								this.setState({ input_fields: { ...this.state.input_fields, ["confirm_password"]: text } })
							}}
						/>
					) : null}
					<View className="flex flex-row items-center align-middle justify-end -mt-2">
						<Text style={{ color: styles.secondaryDark }}>Use a phone number</Text>
						<Switch
							disabled={true}
							value={this.state.input_type === LoginTypes.phone}
							thumbColor={styles.primaryDark}
							onValueChange={(value) => {
								this.setInputType(value ? LoginTypes.phone : LoginTypes.email)
							}}
						/>
					</View>
				</KeyboardAvoidingView>
				{/* button */}
				{this.state.is_keyboard_open ? null : (
					<TouchableOpacity
						onPress={() => {
							HandleForm({
								callback: this.props.callBack,
								form_type: panel_type,
								confirm_password: this.state.input_fields.confirm_password || "",
								email: this.state.input_fields.email || "",
								password: this.state.input_fields.password || "",
								tel: this.state.input_fields.tel || "",
								type: this.state.input_type,
							})
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
				<SwitchAuthPage style={{ marginBottom: this.state.is_keyboard_open ? 4 * 4 : 12 * 4 }} updatePage={updatePage} panel_type={panel_type} />
			</View>
		)
	}
}

async function HandleForm(params: {callback:Function, form_type: number; type: LoginTypes; email: string; password: string; confirm_password: string; tel: string }) {
	const { type, email, password, confirm_password, tel, form_type } = params
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
			const response = await Application.login({ auth_type: type, auth_value: email || tel, password: password  })
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
