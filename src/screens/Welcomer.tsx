import { useEffect, useState } from "react"
import { InitialInfo } from "../components/welcomer/WelcomerRoot"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Text, View } from "react-native"
import Application from "../common/Application"
import CustomLoadingIndicator from "../components/CustomLoadingIndicator"
import * as Updates from "expo-updates"
export default function WelcomerPage(props: { navigation:NativeStackNavigationProp<any> }) {
	const navigation = props.navigation as NativeStackNavigationProp<any>
	const [checkedUpdates, setCheckedUpdates] = useState(false)
	const [isUpdating,setIsUpdating] = useState(false)
	const [availableUpdate,setAvailableUpdate] = useState<Updates.UpdateCheckResult | undefined>(undefined)
	const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean | undefined>(undefined)
	async function onFetchUpdateAsync() {
		if (!Updates.isEnabled) {
			console.log("updates not enabled, returning")
			setCheckedUpdates(true)
			setIsUpdateAvailable(false)
			return
		}
		try {
			const update = await Updates.checkForUpdateAsync()
			// if (update.isAvailable) {
			// 	alert(`Update available on channel ${Updates.channel}: ${update.}`)
			// }
			setCheckedUpdates(true)
			setIsUpdateAvailable(update.isAvailable)
			setAvailableUpdate(update)
		} catch (error : any) {
			if (!(error.message as string).startsWith("checkForUpdateAsync")) {
				alert(`Error fetching latest Expo update: ${error}`)
			}
			// You can also add an alert() to see the error message in case of an error when fetching updates.
			setCheckedUpdates(true)
			setIsUpdateAvailable(false)
		}
	}
	async function update() {
		if (isUpdating) {return}
		setIsUpdating(true)
		await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
		alert(`App has been updated!`)
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
