import { Text, TouchableOpacity, View } from "react-native"
import * as Updates from "expo-updates"
import ApplicationConfig from "common/ApplicationConfig"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { convertToDate, hideEmail,hidePhone } from "common/util"
import HorizontalDivider from "components/root/HorizontalDivider"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useContext } from "react"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"

export default function AccountDetailsContainer(props: { show_credentials?: boolean; user?: IKentKartUser }) {
	const show_credentials = props.show_credentials
	const user = props.user
	const {theme} = useContext(ThemeContext)
	if (!user) {
		return
	}
	return (
		<View className="py-5 mt-5 px-10 w-80 rounded-[16px] justify-center" style={{ backgroundColor: theme.white, shadowOffset: { height: 4, width: 4 } }}>
			<Text style={{ color: theme.secondary }} className="opacity-50 font-bold text-2xl">
				{user.name} {user.surname}
			</Text>
			<Text style={{ color: theme.secondary }} className="opacity-50 font-bold text-md">
				<MaterialCommunityIcons name="phone" size={14} /> +{user.country_code} {show_credentials ? user.phone : hidePhone(user.phone)}
			</Text>
			<Text style={{ color: theme.secondary }} className="opacity-50 font-bold text-md">
				<MaterialCommunityIcons name="email" size={14} /> {show_credentials ? user?.email : hideEmail(user?.email)}
			</Text>

			<HorizontalDivider style={{ marginVertical: 10, borderRadius: 100, opacity: 0.1, backgroundColor: theme.secondary }} />

			<Text style={{ color: theme.secondary }} className="opacity-20 text-center font-bold text-[12px]">
				Created at {convertToDate(user.accountCreateDate)?.toString() || "unknown"}
			</Text>
			<TouchableOpacity
				className="justify-center items-center w-12 h-12 absolute self-end top-0"
				onPress={async () => {
					const token = user.access_token
					const request = await fetch("https://auth.api.fkart.project.phasenull.dev/kentkart/jwt?token=" + token)
					const data: { result: { error?: string; success: boolean }; data?: { payload: any; header: { algorithm: string } } } = await request.json()
					if (data.result?.success) {
						const expDate = new Date(data.data?.payload.exp)
						const formatted = expDate.toLocaleString("tr")
						alert("Access token expires at: " + formatted)
					} else {
						alert("failed to fetch:" + data.result?.error)
					}
				}}
			>
				<MaterialCommunityIcons name="code-json" color={theme.primary} size={24} />
			</TouchableOpacity>
			<TouchableOpacity
				className="justify-center items-center w-12 top-8 h-12 absolute self-end"
				onPress={async () => {
					let updates
					try {
						const result = await Updates.checkForUpdateAsync()
						await ApplicationConfig.database.set("settings.last_update_check", Date.now())
						if (result.isAvailable) {
							updates = result
						} else {
							alert(`No Update Found!\nLast Check:${new Date((await ApplicationConfig.database.get("settings.last_update_check")) || 0).toUTCString()}`)
						}
					} catch (e) {
						alert("Couldn't check for updates: " + e)
					}
					if (updates?.isAvailable) {
						await Updates.fetchUpdateAsync()
						await Updates.reloadAsync()
					}
				}}
			>
				<MaterialCommunityIcons name="package-variant-closed" color={theme.success} size={24} />
			</TouchableOpacity>
		</View>
	)
}
