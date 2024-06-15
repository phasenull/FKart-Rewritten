import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StatusBar, Text, TouchableOpacity, View } from "react-native"
import { useContext } from "react"
import KentKartAuthValidator from "components/validators/KentKartAuthValidator"
import CardJSONData from "screens/card_details/CardJSONData"
import AuthWall from "components/walls/AuthWall"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"

export default function HomeTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	const {theme} = useContext(ThemeContext)
	const {user,credentials} = useKentKartAuthStore((state)=>state)
	return (
		<View style={{ backgroundColor: theme.dark }} className="h-full w-full justify-center items-center">
			<StatusBar hidden={false} />
			{/* login prompt */}
			<KentKartAuthValidator else={<AuthWall navigation={navigation}/>}>
				<Text className="mx-auto font-bold opacity-50 text-[24px]">Hello, {`${user?.name} ${user?.surname}`}</Text>
				<CardJSONData favorite_data={user} card={{access_token:credentials.access_token?.slice(0,10)+"...",refresh_token:credentials.refresh_token?.slice(0,4)+"..."}}/>

				<TouchableOpacity
					className="w-48 h-16 justify-center self-center"
					onPress={() => {
						// logout()
					}}
					style={{
						backgroundColor: theme.secondary,
						padding: 10,
						borderRadius: 10,
						bottom:9.5*4
					}}
				>
					<Text style={{ color: theme.white }} className="font-bold text-center">
						Logout
					</Text>
				</TouchableOpacity>
			</KentKartAuthValidator>
		</View>
	)
}
