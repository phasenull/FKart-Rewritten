import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Text, TouchableOpacity, View } from "react-native"
import SecondaryText from "./SecondaryText"
import Application from "../common/Application"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export default function AuthWall(props: { navigation: NativeStackNavigationProp<any> }) {
	const navigator = props.navigation
	return (
		<View className="flex-1 items-center justify-center">
			<MaterialCommunityIcons name="lock" size={48*4} style={{opacity:0.3,color:Application.styles.secondary,marginBottom:2*4}} />
			<SecondaryText >We are not able to show this page to you</SecondaryText>
			<TouchableOpacity style={{ backgroundColor: Application.styles.primary,borderRadius: 4 * 4,marginTop:16*4 }}
			onPress={()=>{
				if (!navigator) {
					return alert("Navigator is null! You should not be seeing this, please report: contact@phasenull.dev")
				}
				navigator.replace("auth")
			}}
			>
				<SecondaryText style={{ color: Application.styles.white, marginHorizontal: 8 * 4, marginVertical: 4 * 4,fontWeight:"900",fontSize:24  }}>Log In</SecondaryText>
			</TouchableOpacity>
		</View>
	)
}
