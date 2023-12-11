import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import Application from "../util/Application"
import User from "../util/classes/User"

export default function MainScreen(props: { route:any,navigation: NativeStackNavigationProp<any>} ) {
	const { navigation } = props
	const styles = Application.styles
	const user : User = props.route.params?.user || new User()
	return (
		<SafeAreaView style={{ backgroundColor: styles.primary }} className="h-full w-full justify-center">
			<StatusBar hidden={false} />
			{/* login prompt */} 
			<Text className="mx-auto mt-4 font-bold opacity-50 text-[24px]">Hello, {`${user?.name} ${user?.surname}`}</Text>
			<Text className="mx-auto mt-4 font-bold opacity-50 text-[24px]">Your email is {`${user?.email?.slice(0,5)}${"*".repeat(user?.email?.split("@")[0].slice(5).length as number)}@${user?.email?.split("@")[1]}`}</Text>
			<Text className="mx-auto mt-4 font-bold opacity-50 text-[24px]">Your phone is {user?.phone}</Text>
			<Text className="mx-auto mt-4 font-bold opacity-50 text-[24px]">Your id is {user?.accountId}</Text>


			<TouchableOpacity
				className="w-48 h-16 justify-center"
				onPress={async () => {
					await Application.logout()
					navigation.navigate("auth")
				}}
				style={{ backgroundColor: styles.secondary, padding: 10, borderRadius: 10, margin: 10 }}
			>
				<Text style={{ color: styles.white }} className="font-bold text-center">
					Logout
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	)
}
