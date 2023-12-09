import { KeyboardAvoidingView, Switch, SwitchComponent, Text, TextInput, TouchableOpacity, View } from "react-native"
import Application from "../util/Application"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import LoginTypes from "../enums/LoginTypes"
import { Component, ReactNode, useState } from "react"
import SwitchAuthPage from "./rare/SwitchAuthPage"
type AuthPanelProps = { updatePage: (index: number) => void; panel_type: number }
export default class AuthPanel extends Component<AuthPanelProps> {
	state: { input_type: LoginTypes; input_fields: { email: string; password: string; tel: string } }
	constructor(props: AuthPanelProps) {
		super(props)
		this.state = {
			input_type: LoginTypes.email,
			input_fields: {
				email: "",
				password: "",
				tel: "",
			},
		}
	}
	setInputType = (type: LoginTypes) => {
		this.setState({ input_type: type })
	}
	render(): ReactNode {
		console.log("rendering")
		const { panel_type, updatePage } = this.props
		const styles = Application.styles
		const theme = Application.theme
		return (
			<View style={{ backgroundColor: styles.white }} className="h-full py-4 items-center w-1/2">
				<View className="flex flex-col mx-auto justify-center mt-32 h-64 w-64">
					<Text style={{ color: styles.secondaryDark }} className="text-4xl text-left font-bold">
						{panel_type === 0 ? "Sign In" : "Sign Up"}
					</Text>
					<Text style={{ color: styles.secondaryDark }} className="text-lg opacity-50 font-bold">
						{panel_type === 0 ? "Welcome Back!" : "Welcome!"}
					</Text>
					{/* input with border and shadow */}
					<TextInput
						autoComplete={this.state.input_type === LoginTypes.email ? "email" : "tel"}
						style={{ color: styles.secondaryDark }}
						placeholderTextColor={styles.secondaryDark}
						inputMode={this.state.input_type === LoginTypes.email ? "email" : "tel"}
						placeholder={this.state.input_type === LoginTypes.email ? "E-Mail" : "Phone Number"}
						className="mt-8 border-2 w-full h-16 border-slate-200 rounded-[10px] px-8 py-2 shadow-2xl"
						value={this.state.input_fields[this.state.input_type === LoginTypes.email ? "email" : "tel"] || ""}
						onChangeText={(text) => {
							this.setState({ input_fields: { ...this.state.input_fields, [this.state.input_type === LoginTypes.email ? "email" : "tel"]: text } })
						}}
					/>
					<View className="flex flex-row items-center align-middle justify-end -mt-2">
						<Text style={{color:styles.secondaryDark}}>Use a phone number</Text>
						<Switch
							value={this.state.input_type === LoginTypes.phone}
							thumbColor={styles.primaryDark}
							onValueChange={(value) => {
								this.setInputType(value ? LoginTypes.phone : LoginTypes.email)
							}}
						/>
					</View>
				</View>
				<TouchableOpacity className="mt-12 -mr-44 w-max" activeOpacity={0.6}>
					<LinearGradient className="rounded-[16px] px-3" start={[0, 0.5]} end={[1, 0.5]} colors={[styles.primary, styles.primaryDark]}>
						<Text style={{ color: styles.white }} className="text-2xl text-center font-bold pl-5 pr-2 py-3">
							{panel_type === 0 ? "Sign In" : "Sign Up"}
							{"    ➜"}
						</Text>
					</LinearGradient>
				</TouchableOpacity>
				<SwitchAuthPage updatePage={updatePage} panel_type={panel_type} />
			</View>
		)
	}
}
