import { useContext } from "react";
import { UserContext } from "../../common/contexts/UserContext";
import Application from "../../common/Application";
import { View } from "react-native";
import { Text } from "react-native";
import CustomLoadingIndicator from "../CustomLoadingIndicator";

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