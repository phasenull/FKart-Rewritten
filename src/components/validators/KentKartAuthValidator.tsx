import { useContext } from "react";
import { Text, View } from "react-native";
import ApplicationConfig from "common/ApplicationConfig";
import CustomLoadingIndicator from "components/root/CustomLoadingIndicator";
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore";

export default function KentKartAuthValidator(props:{children:any,else?:any}) {
	const {user} = useKentKartAuthStore((state)=>state)
	if (user) {
		return props.children
		}
	return props.else || null
}