import { useContext } from "react"
import { UserContext } from "../../common/contexts/UserContext"
import Application from "../../common/Application"
import { View } from "react-native"
import { Text } from "react-native"
import CustomLoadingIndicator from "../root/CustomLoadingIndicator"
import { FKartContext } from "../../common/contexts/FKartContext"

export default function FKartAuthValidator(props: { children: any; else?: any }) {
	const { fetchRefreshToken, fkartUser } = useContext(FKartContext)
	// if (isFetching) {
	// 	return (
	// 		<View>
	// 			<Text>Validating your login information</Text>
	// 			<CustomLoadingIndicator />
	// 		</View>
	// 	)
	// }
	if (fkartUser) {
		return props.children
	}
	return props.else || null
}
