import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"

export default function CityValidator(props: { children: any; else?: any; redirect?: boolean; navigation: NativeStackNavigationProp<any> }) {
	const { region,__init } = useKentKartAuthStore((state) => state)
	if (!__init) {return}
	if (!region) {
		if (props.redirect) {
			console.log("redirect to city_selector")
			return props.navigation.replace("city_selector")
		}
		console.log("city_selector else")
		return props.else || null
	}
	return props.children
}
