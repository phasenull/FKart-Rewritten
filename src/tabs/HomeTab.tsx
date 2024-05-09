import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import Application from "../common/Application"
import User from "../common/classes/User"
import { hidePhone } from "../util"
import { useContext } from "react"
import { UserContext } from "../common/contexts/UserContext"
import KentKartAuthValidator from "../components/validators/KentKartAuthValidator"
import AuthWall from "../components/root/walls/AuthWall"
import CardJSONData from "../components/screen_components/card_details/CardJSONData" 

export default function HomeTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	const styles = Application.styles
	const { error, isError, isFetching, loggedUser: user, logout } = useContext(UserContext)
	return (
		<SafeAreaView style={{ backgroundColor: styles.dark }} className="h-full w-full justify-center items-center">
			<StatusBar hidden={false} />
			{/* login prompt */}
			<KentKartAuthValidator else={<AuthWall navigation={navigation}/>}>
				<Text className="mx-auto font-bold opacity-50 text-[24px]">Hello, {`${user?.name} ${user?.surname}`}</Text>
				<CardJSONData favorite_data={user} card={{access_token:user?.access_token?.slice(0,20)+"..."}}/>

				<TouchableOpacity
					className="w-48 h-16 justify-center self-center"
					onPress={() => {
						logout()
					}}
					style={{
						backgroundColor: styles.secondary,
						padding: 10,
						borderRadius: 10,
						bottom:9.5*4
					}}
				>
					<Text style={{ color: styles.white }} className="font-bold text-center">
						Logout
					</Text>
				</TouchableOpacity>
			</KentKartAuthValidator>
		</SafeAreaView>
	)
}
