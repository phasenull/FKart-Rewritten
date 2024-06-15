import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { TouchableOpacity, View } from "react-native"
import SecondaryText from "components/reusables/SecondaryText"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useContext } from "react"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import { ThemeContext } from "common/contexts/ThemeContext"

export default function AuthWall(props: { navigation: NativeStackNavigationProp<any> }) {
	const {theme} = useContext(ThemeContext)
	const navigator = props.navigation
	const {translations} = useContext(TranslationsContext)
	return (
		<View className="flex-1 items-center justify-center">
			<MaterialCommunityIcons name="lock" size={48*4} style={{opacity:0.3,color:theme.secondary,marginBottom:2*4}} />
			<SecondaryText >{translations.authwall.we_are_not_able_to_show_this_page_to_you}</SecondaryText>
			<TouchableOpacity style={{ backgroundColor: theme.primary,borderRadius: 4 * 4,marginTop:16*4 }}
			onPress={()=>{
				if (!navigator) {
					return alert("Navigator is null! You should not be seeing this, please report: contact@phasenull.dev")
				}
				navigator.replace("auth")
			}}
			>
				<SecondaryText style={{ color: theme.white, marginHorizontal: 8 * 4, marginVertical: 4 * 4,fontWeight:"900",fontSize:24  }}>{translations.signin}</SecondaryText>
			</TouchableOpacity>
		</View>
	)
}
