import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import FKartAuthTypeSelector from "screens/fkart/auth/AuthTypeSelector"

export default function FKartAuthWall(props: { navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	return (
		<FKartAuthTypeSelector navigation={navigation} />
	)
}
