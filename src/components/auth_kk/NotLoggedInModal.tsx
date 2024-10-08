import { ThemeContext } from "common/contexts/ThemeContext";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function NotLoggedInModal(props: { param_visible: boolean; onRequestClose: () => void; }) {
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
						style={{
							backgroundColor:theme.primary
						}}
						className="px-4 py-2"
						onPress={() => {
							router.push("/auth_kk")
						}}
					>
						<Text className="text-md w-16 text-center">Sign In</Text>
					</TouchableOpacity>
					<TouchableOpacity
						disabled={false}
						style={{backgroundColor:theme.secondary}}
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
