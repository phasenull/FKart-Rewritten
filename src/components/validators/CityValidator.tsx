import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"

export default function CityValidator(props: { children: any; else?: any; redirect?: boolean; navigation: NativeStackNavigationProp<any> }) {
	const { user, region } = useKentKartAuthStore((state) => state)
	if (!user || !user.region || !region) {
		if (props.redirect) {
			props.navigation.replace("city_selector")
			return
		}
		return props.else || null
	}
	return props.children
}
