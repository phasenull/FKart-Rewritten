import { useKentKartAuthStore } from "common/stores/KentKartAuthStore";
import { Redirect } from "expo-router";

export default function CityValidator(props: { children: any; else?: any; redirect?: boolean}) {
	const  region  = useKentKartAuthStore((state) => state.region)
	if (!region) {
		if (props.redirect) {
			console.log("redirect to city_selector")
			return <Redirect href={{pathname:"/city_selector"}}/>
		}
		console.log("city_selector else")
		return props.else || null
	}
	return props.children
}
