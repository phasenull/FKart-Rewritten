import { useEffect, useState } from "react"
import { InitialInfo } from "../components/welcomer/WelcomerRoot"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Text, View } from "react-native"
import Application from "../common/Application"
import CustomLoadingIndicator from "../components/CustomLoadingIndicator"
import * as Updates from "expo-updates"
import Logger from "../common/Logger"
export default function WelcomerPage(props: { navigation:NativeStackNavigationProp<any> }) {
	const navigation = props.navigation as NativeStackNavigationProp<any>
	const [checkedUpdates, setCheckedUpdates] = useState(false)
	const [isUpdating,setIsUpdating] = useState(false)
	const [availableUpdate,setAvailableUpdate] = useState<Updates.UpdateCheckResult | undefined>(undefined)
	const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean | undefined>(undefined)
	const [lastCheck,setLastCheck] = useState<number>(0)
	async function onFetchUpdateAsync() {
		const last_check = await Application.database.get("settings.last_update_check") || 0
		setLastCheck(last_check)
		Logger.info("Welcomer.tsx",`Last update checked at ${new Date(last_check).toUTCString()} | ${last_check}`)
		if (last_check && (Date.now() - last_check < Application.expo_updates_check_interval)) {
			setCheckedUpdates(true)
			setIsUpdateAvailable(false)
			return
		}
		if (!Updates.isEnabled) {
			console.log("updates not enabled, returning")
			setCheckedUpdates(true)
			setIsUpdateAvailable(false)
			return
		}
		try {
			await Application.database.set("settings.last_update_check",Date.now())
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
		return <InitialInfo last_check={lastCheck} navigation={navigation} />
	}
}
