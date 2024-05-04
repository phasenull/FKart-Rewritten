import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import Application from "../../common/Application"
import User from "../../common/classes/User"
import { hidePhone } from "../../util"
import { useContext } from "react"
import { UserContext } from "../../common/contexts/UserContext"
import KentKartAuthValidator from "../../components/validators/KentKartAuthValidator"
import AuthWall from "../../components/AuthWall"

export default function HomeTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	const styles = Application.styles
	const { error, isError, isFetching, loggedUser: user, logout } = useContext(UserContext)
	return (
		<SafeAreaView style={{ backgroundColor: styles.dark }} className="h-full w-full justify-center">
			<StatusBar hidden={false} />
			{/* login prompt */}
			<KentKartAuthValidator else={<AuthWall navigation={navigation}/>}>
				<Text className="mx-auto mt-4 font-bold opacity-50 text-[24px]">Hello, {`${user?.name} ${user?.surname}`}</Text>
				<Text className="mx-auto mt-4 font-bold opacity-50 text-[24px]">
					Your email is {`${user?.email?.slice(0, 5)}${"*".repeat(user?.email?.split("@")[0].slice(5).length as number)}@${user?.email?.split("@")[1]}`}
				</Text>
				<Text className="mx-auto mt-4 font-bold opacity-50 text-[24px]">Your phone is {hidePhone(user?.phone)}</Text>
				<Text className="mx-auto mt-4 font-bold opacity-50 text-[24px]">Your id is {user?.accountId}</Text>

				<TouchableOpacity
					className="w-48 h-16 justify-center self-center"
					onPress={() => {
						logout()
					}}
					style={{
						backgroundColor: styles.secondary,
						padding: 10,
						borderRadius: 10,
						margin: 10,
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
