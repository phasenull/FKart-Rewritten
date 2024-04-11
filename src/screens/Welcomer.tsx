import { useState } from "react"
import { InitialInfo } from "../components/welcomer/InitialInfo"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Text, View } from "react-native"
import Application from "../common/Application"
import CustomLoadingIndicator from "../components/CustomLoadingIndicator"
import * as Updates from 'expo-updates';
export default function WelcomerPage(props: { route: any }) {
	const { isCheckingUpdate, isUpdateAvailable } = props.route.params
	console.log(isCheckingUpdate, isUpdateAvailable)
	const [show, setShow] = useState<"initial_info" | "auth_page">("initial_info")
	if (isCheckingUpdate) {
		return (
			<View className="flex-1 gap-y-10 flex-col items-center justify-center" style={{ backgroundColor: Application.styles.dark }}>
				<View>
					<CustomLoadingIndicator size={64} />
				</View>
				<Text
					// className="bg-red-400"
					style={{
						color: Application.styles.secondary,
						fontWeight: "800",
						fontSize:24
					}}
				>
					Checking Updates
				</Text>
			</View>
		)
	}if (isUpdateAvailable) {
		return (
			<View className="flex-1 gap-y-10 flex-col items-center justify-center" style={{ backgroundColor: Application.styles.dark }}>
				<View>
					<CustomLoadingIndicator size={64} />
				</View>
				<Text
					// className="bg-red-400"
					style={{
						color: Application.styles.secondary,
						fontWeight: "800",
						fontSize:24
					}}
				>
					Updating to {Updates.createdAt?.getUTCDate()}
				</Text>
			</View>
		)
	}
	if (show == "initial_info") {
		return <InitialInfo />
	}
}
