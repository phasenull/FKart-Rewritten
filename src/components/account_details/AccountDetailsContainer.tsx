import { Text, TouchableOpacity, View } from "react-native"
import User from "../../common/classes/User"
import * as Updates from "expo-updates"
import Application from "../../common/Application"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { hideEmail, hidePhone } from "../../util"
import HorizontalDivider from "../HorizontalDivider"

export default function AccountDetailsContainer(props: { show_credentials?: boolean; user: User }) {
	const show_credentials = props.show_credentials
	const styles = Application.styles
	const user = props.user
	return (
		<View
			className="py-5 mt-5 px-10 w-80 rounded-[16px] justify-center"
			style={{ backgroundColor: styles.white, shadowOffset: { height: 4, width: 4 } }}
		>
			<Text style={{ color: styles.secondary }} className="opacity-50 font-bold text-2xl">
				{user.name} {user.surname}
			</Text>
			<Text style={{ color: styles.secondary }} className="opacity-50 font-bold text-md">
				<MaterialCommunityIcons name="phone" size={14} /> +{user.country_code} {show_credentials ? user.phone : hidePhone(user.phone)}
			</Text>
			<Text style={{ color: styles.secondary }} className="opacity-50 font-bold text-md">
				<MaterialCommunityIcons name="email" size={14} />{" "}
				{show_credentials ? user?.email : hideEmail(user?.email)}
			</Text>

			<HorizontalDivider style={{ marginVertical: 10, borderRadius: 100, opacity: 0.1, backgroundColor: styles.secondary }} />

			<Text style={{ color: styles.secondary }} className="opacity-20 text-center font-bold text-[12px]">
				Created at {Application.CONVERT_TO_DATE(user.accountCreateDate)?.toString() || "unknown"}
			</Text>
			<TouchableOpacity className="justify-center items-center w-12 h-12 absolute self-end top-0" onPress={async () => {
				const token = Application.logged_user?.access_token
				const request = await fetch("https://auth.api.fkart.project.phasenull.dev/kentkart/jwt?token="+token)
				const data : {result:{error?:string,success:boolean},data?:{payload:any,header:{algorithm:string}}} = await request.json()
				if (data.result?.success) {
					const expDate = new Date(data.data?.payload.exp)
					const formatted = expDate.toLocaleString("tr")
					alert("Access token expires at: " + formatted)
				} else {
					alert("failed to fetch:"+data.result?.error)
				}
			}}>
				<MaterialCommunityIcons name="code-json" color = {Application.styles.primary} size={24}/>
			</TouchableOpacity>
			<TouchableOpacity className="justify-center items-center w-12 top-8 h-12 absolute self-end" onPress={async () => {
				let updates
				try {
					const result = await Updates.checkForUpdateAsync()
					if (result.isAvailable) {
						updates = result
					} else {
						alert("No Update Found!")
					}
				} catch (e) {
					alert("Couldn't check for updates: "+e)
				}
				if (updates?.isAvailable) {
					await Updates.fetchUpdateAsync()
					await Updates.reloadAsync()
				}
			}}>
				<MaterialCommunityIcons name="package-variant-closed" color = {Application.styles.success} size={24}/>
			</TouchableOpacity>
		</View>
	)
}
