import { useContext, useState } from "react"
import { Modal, Text, TouchableOpacity, View } from "react-native"
import Application from "../../../common/Application"
import { Navigator } from "expo-router"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ThemeContext } from "../../../common/contexts/ThemeContext"

export default function NotLoggedInModal(props: { param_visible: boolean; onRequestClose: () => void; navigation: NativeStackNavigationProp<any> }) {
	const { param_visible } = props
	const [visible, setVisible] = useState(param_visible)
	const {theme} = useContext(ThemeContext)
	return (
		<Modal
			collapsable={true}
			visible={visible}
			onRequestClose={() => {
				setVisible(false)
				props.onRequestClose()
			}}
			transparent={true}
			animationType="slide"
		>
			<View className="w-80 h-max px-8 pt-8 pb-4 my-auto mx-auto">
				<Text className="text-lg">Hey!</Text>
				<Text className="text-sm">Seems like you are not signed in! You can either sign in or use incognito mode. </Text>
				<View className="flex flex-row mt-16 justify-between">
					<TouchableOpacity
						style={theme.buttonPrimary}
						className="px-4 py-2"
						onPress={() => {
							props?.navigation?.push("auth")
						}}
					>
						<Text className="text-md w-16 text-center">Sign In</Text>
					</TouchableOpacity>
					<TouchableOpacity
						disabled={false}
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
		</Modal>
	)
}
