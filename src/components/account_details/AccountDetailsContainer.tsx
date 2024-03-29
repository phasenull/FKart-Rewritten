import { Text, View } from "react-native"
import User from "../../common/classes/User"
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
			style={{ backgroundColor: styles.white, elevation: 2, shadowOffset: { height: 4, width: 4 } }}
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
		</View>
	)
}
