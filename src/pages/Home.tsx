import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { Button, Modal, Pressable, Text, TouchableHighlight, TouchableOpacity, View } from "react-native"
import Application from "../util/Application"
import NotLoggedInModal from "../components/NotLoggedInModal"

export default function HomePage(props : { navigation:NativeStackNavigationProp<any> }) {
	const [user, setUser] : [undefined | null,any] = useState(undefined)
	const {navigation} = props
	const [prompt_log_in, set_prompt_log_in] = useState(false)

	const theme = Application.theme
	const styles = Application.styles
	useEffect(() => {
		async function get() {
			const user_data = Application.logged_user
			console.log("user_data",user_data)
			if (user_data) {
				setUser(user_data)
			} else{
				console.log("user not logged in")
				setTimeout(() => {
					set_prompt_log_in(true)
				}, 1000)
			}
		}
		get()
	}, [])
	return (
		<View style={{ backgroundColor: styles.primary }}>
			<StatusBar style="auto" />
			<Text>Home {prompt_log_in ? "logged in" : "NOT logged in !!!"}</Text>
			{/* login prompt */}
			{prompt_log_in ? <NotLoggedInModal navigation={navigation} onRequestClose={()=>{}} param_visible={true} /> : null}
		</View>
	)
}
