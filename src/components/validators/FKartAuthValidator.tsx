import { useFKartAuthStore } from "common/stores/FKartAuthStore";

export default function FKartAuthValidator(props: { children: any; else?: any }) {
	const { user } = useFKartAuthStore()
	// if (isFetching) {
	// 	return (
	// 		<View>
	// 			<Text>Validating your login information</Text>
	// 			<CustomLoadingIndicator />
	// 		</View>
	// 	)
	// }
	if (user) {
		return props.children
	}
	return props.else ? props.else : null
}
