import { useContext } from "react";
import { Text, View } from "react-native";
import Application from "../../common/Application";
import { UserContext } from "../../common/contexts/UserContext";
import CustomLoadingIndicator from "../root/CustomLoadingIndicator";

export default function KentKartAuthValidator(props:{children:any,else?:any}) {
	const {loggedUser,isFetching} = useContext(UserContext)
	if (isFetching) {
		return <View>
			<Text>Validating your login information</Text>
			<CustomLoadingIndicator/>
		</View>
	}
	if (loggedUser && Application.logged_user) {
		return props.children
	}
	return props.else || null
}