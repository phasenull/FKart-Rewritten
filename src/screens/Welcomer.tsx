import { useEffect, useState } from "react"
import { InitialInfo } from "../components/welcomer/InitialInfo"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Text, View } from "react-native"
import Application from "../common/Application"
import CustomLoadingIndicator from "../components/CustomLoadingIndicator"
import * as Updates from "expo-updates"
export default function WelcomerPage(props: { navigation:NativeStackNavigationProp<any> }) {
	const navigation = props.navigation as NativeStackNavigationProp<any>
	const [checkedUpdates, setCheckedUpdates] = useState(false)
	const [isUpdating,setIsUpdating] = useState(false)
	const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean | undefined>(undefined)
	async function onFetchUpdateAsync() {
		try {
			const update = await Updates.checkForUpdateAsync()
			// if (update.isAvailable) {
			// 	alert(`Update available on channel ${Updates.channel}: ${update.}`)
			// }
			setCheckedUpdates(true)
			setIsUpdateAvailable(update.isAvailable)
		} catch (error) {
			// You can also add an alert() to see the error message in case of an error when fetching updates.
			alert(`Error fetching latest Expo update: ${error}`)
			setCheckedUpdates(true)
			setIsUpdateAvailable(false)
		}
	}
	async function update() {
		if (isUpdating) {return}
		setIsUpdating(true)
		await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
	}
	useEffect(() => {
		onFetchUpdateAsync()
	}, [])
	
	const [show, setShow] = useState<"initial_info" | "auth_page">("initial_info")
	if (!checkedUpdates) {
		return (
			<View className="flex-1 gap-y-10 flex-col items-center justify-center" style={{ backgroundColor: Application.styles.dark }}>
				<View>
					<CustomLoadingIndicator size={48} />
				</View>
				<Text
					// className="bg-red-400"
					style={{
						color: Application.styles.secondary,
						fontWeight: "800",
						fontSize: 24,
					}}
				>
					Checking Updates in {Updates.channel}
				</Text>
			</View>
		)
	}
	if (isUpdateAvailable) {
		update()
		return (
			<View className="flex-1 gap-y-10 flex-col items-center justify-center" style={{ backgroundColor: Application.styles.dark }}>
				<View>
					<CustomLoadingIndicator size={48} />
				</View>
				<Text
					// className="bg-red-400"
					style={{
						color: Application.styles.secondary,
						fontWeight: "800",
						fontSize: 24,
					}}
				>
					Updating to {Updates.createdAt?.getUTCDate()}
				</Text>
			</View>
		)
	}
	if (show == "initial_info") {
		return <InitialInfo navigation={navigation} />
	}
}
