import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StatusBar, Text, TouchableOpacity, View } from "react-native"
import { useContext } from "react"
import KentKartAuthValidator from "components/validators/KentKartAuthValidator"
import CardJSONData from "app/card_details/CardJSONData"
import AuthWall from "components/walls/AuthWall"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import SimplyButton from "components/ui/SimplyButton"
import NavigationContainer from "./sections/NavigationContainer"
import { ScrollView } from "react-native"
import useGetProfileData from "common/hooks/kentkart/user/useGetProfileData"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import { RefreshControl } from "react-native-gesture-handler"

export default function HomeTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props
	const { theme } = useContext(ThemeContext)
	const {data,isLoading,refetch,isRefetching} = useGetProfileData()
	const credentials = useKentKartAuthStore((state)=>state.credentials)
	const {logout} = useKentKartAuthStore()
	if (isLoading) {
		return <CustomLoadingIndicator/>
	}
	return (
		<KentKartAuthValidator else={<AuthWall navigation={navigation} />}>
			<ScrollView refreshControl={<RefreshControl onRefresh={refetch} refreshing={isLoading||isRefetching} />} style={{ backgroundColor: theme.dark }} contentContainerStyle={{ alignItems: "center",paddingVertical:20*4 }}>
				<Text className="mx-auto font-bold opacity-50 text-[24px]">Hello, {`${data?.data.accountInfo?.name} ${data?.data.accountInfo?.surname}`}</Text>
				<NavigationContainer navigation={props.navigation} />
				<View className="flex flex-row space-x-4">
					<SimplyButton text="logout" size="medium" type="secondary" color={theme.error} onPress={logout} />

					<SimplyButton
						onPress={() => {
							navigation.push("r8r")
						}}
						type="primary"
						size="medium"
						text="R8R"
					/>
				</View>
				<CardJSONData favorite_data={{...data?.data.accountInfo,phone:`${data?.data.accountInfo?.phone.slice(0,3)}${"*".repeat((data?.data.accountInfo?.phone.length||10)-3)}`}} card={{ access_token: credentials.access_token?.slice(0, 10) + "...", refresh_token: credentials.refresh_token?.slice(0, 4) + "..." }} />
			</ScrollView>
		</KentKartAuthValidator>
	)
}
