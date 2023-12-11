import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import Application from "../util/Application"
import User from "../util/classes/User"
import AccountDetailsPanel from "../components/rare/AccountDetailsPanel"

export default function AccountScreen(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props

	const styles = Application.styles
	const user: User = props.route.params?.user
	return (
		<View style={{ backgroundColor: styles.dark }} className="flex-1 items-center justify-center">
			{/* login prompt */}
			<ScrollView
				horizontal={false}
				showsVerticalScrollIndicator={true}
				contentContainerStyle={{ marginVertical: 40, justifyContent: "center", alignItems: "center" }}
				className="w-full"
			>
				<AccountDetailsPanel user={user} />

				<TouchableOpacity
					className="justify-end"
					onPress={async () => {
						await Application.logout()
						navigation.navigate("auth")
					}}
					style={{
						backgroundColor: styles.warning,
						paddingHorizontal: 20,
						paddingVertical: 10,
						borderRadius: 10,
						margin: 10,
						elevation: 5,
						shadowOffset: { height: 2, width: 2 },
					}}
				>
					<Text style={{ color: styles.white }} className="font-bold text-lg text-center">
						Logout
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	)
}
