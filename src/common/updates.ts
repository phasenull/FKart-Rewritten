import ApplicationConfig from "common/ApplicationConfig"
import * as Updates from "expo-updates"

/** checks the OTA channel, downloads and reloads if there is a newer update; works without an account */
export async function checkForUpdates() {
	let update: Updates.UpdateCheckResult | undefined
	try {
		const result = await Updates.checkForUpdateAsync()
		await ApplicationConfig.database.set("settings.last_update_check", Date.now())
		if (result.isAvailable) {
			update = result
		} else {
			alert(`No Update Found!\nLast Check:${new Date((await ApplicationConfig.database.get("settings.last_update_check")) || 0).toUTCString()}`)
		}
	} catch (e) {
		alert("Couldn't check for updates: " + e)
	}
	if (update?.isAvailable) {
		await Updates.fetchUpdateAsync()
		await Updates.reloadAsync()
	}
}
