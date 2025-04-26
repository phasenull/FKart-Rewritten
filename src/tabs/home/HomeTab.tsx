import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ThemeContext } from "common/contexts/ThemeContext"
import useGetProfileData from "common/hooks/kentkart/user/useGetProfileData"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import CardJSONData from "components/card_details/CardJSONData"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import SimplyButton from "components/ui/SimplyButton"
import KentKartAuthValidator from "components/validators/KentKartAuthValidator"
import AuthWall from "components/walls/AuthWall"
import { router } from "expo-router"
import { useContext } from "react"
import { ScrollView, Text, View } from "react-native"
import { RefreshControl } from "react-native-gesture-handler"
import NavigationContainer from "./sections/NavigationContainer"
import SecondaryText from "components/reusables/SecondaryText"

export default function HomeTab(props: { route: any; }) {
	const { theme } = useContext(ThemeContext)
	const { data, isLoading, refetch, isRefetching } = useGetProfileData()
	const credentials = useKentKartAuthStore((state) => state.credentials)
	const { logout } = useKentKartAuthStore()
	if (isLoading) {
		return <CustomLoadingIndicator />
	}
	return (
		<KentKartAuthValidator else={<AuthWall />}>
			<ScrollView refreshControl={<RefreshControl onRefresh={refetch} refreshing={isLoading || isRefetching} />} style={{ backgroundColor: theme.dark }} contentContainerStyle={{ alignItems: "center", paddingVertical: 20 * 4 }}>
				<Text className="mx-auto font-bold opacity-50 text-[24px]">Hello, {`${data?.data.accountInfo?.name} ${data?.data.accountInfo?.surname}`}</Text>
				{/* <NavigationContainer /> */}
				<SecondaryText className="my-4 text-4xl">
					Quick Services
				</SecondaryText>
				<View className="flex mb-12 flex-row space-x-4">
					<SimplyButton
						onPress={() => {
							router.navigate("/snipe")
						}}
						type="primary"
						size="medium"
						text="snipe"
					/>
					<SimplyButton
						onPress={() => {
							router.navigate("/R8R")
						}}
						type="primary"
						size="medium"
						text="R8R"
					/>
					<SimplyButton
						onPress={() => {
							router.navigate({pathname:"/maps/Groupped"})
						}}
						type="primary"
						size="medium"
						text="Groupped Map"
					/>
				</View>
				<CardJSONData favorite_data={{ ...data?.data.accountInfo, phone: `${data?.data.accountInfo?.phone.slice(0, 3)}${"*".repeat((data?.data.accountInfo?.phone.length || 10) - 3)}` }} card={{ access_token: credentials.access_token?.slice(0, 10) + "...", refresh_token: credentials.refresh_token?.slice(0, 4) + "..." }} />
				{/* <SimplyButton text="logout" size="medium" type="secondary" color={theme.error} onPress={logout} /> */}
			</ScrollView>
		</KentKartAuthValidator>
	)
}
