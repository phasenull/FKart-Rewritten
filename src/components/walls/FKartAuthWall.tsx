import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import FKartAuthTypeSelector from "../../screens/FKart/auth/AuthTypeSelector"
import FKartAuthValidator from "../validators/FKartAuthValidator"
import NothingToSeeHere from "./NothingToSeeHere"

export default function FKartAuthWall(props: { navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	return (
		<FKartAuthTypeSelector navigation={navigation} />
	)
}
