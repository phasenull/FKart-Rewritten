import { useState } from "react"
import { Modal, Text, TouchableOpacity, View } from "react-native"
import Application from "../util/Application"
import { Navigator } from "expo-router"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

export default function NotLoggedInModal(props:{ param_visible : boolean, onRequestClose : () => void, navigation : NativeStackNavigationProp<any> }) {
	const {param_visible} = props
	const [visible, setVisible] = useState(param_visible)
	const theme = Application.theme
	const styles = Application.styles
	return (<Modal
		collapsable={true}
		visible={visible}
		onRequestClose={() => {
			setVisible(false)
			props.onRequestClose()
		}}
		transparent={true}
		animationType="slide"
	>
		<View style={theme.modal} className="w-80 h-48 px-8 py-8 my-auto mx-auto">
			<Text className="text-lg">Hey!</Text>
			<Text className="text-sm">Seems like you are not signed in!</Text>
			<View className="flex flex-row mt-16 justify-between">
				<TouchableOpacity style={theme.buttonPrimary} className="px-4 py-2" onPress={() => {
					props?.navigation?.push("auth")
				}}>
					<Text className="text-md w-16 text-center">Login</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={theme.buttonSecondary}
					className="px-4 py-2"
					onPress={() => {
						setVisible(false)
						props.onRequestClose()
					}}
				>
					<Text className="text-md h-4 text-white text-center">No, Thanks!</Text>
				</TouchableOpacity>
			</View>
		</View>
	</Modal>)
}