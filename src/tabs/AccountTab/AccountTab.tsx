import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import AccountDetailsContainer from "./components/AccountDetailsContainer"
import { useContext, useEffect, useState } from "react"
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native"

import { Favorite } from "common/interfaces/KentKart/Favorite"
import { AddCard } from "./components/AddCard"
import CardContainer from "./components/CardContainer"

import { ThemeContext } from "common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import KentKartAuthValidator from "components/validators/KentKartAuthValidator"
import SeasonValidator from "components/validators/SeasonValidator"
import AuthWall from "components/walls/AuthWall"
import SimplyButton from "components/ui/SimplyButton"
import { useQuery } from "react-query"
import useGetFavorites from "common/hooks/kentkart/user/useGetFavorites"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
export default function AccountTab(props?: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const { theme } = useContext(ThemeContext)
	if (!props) {
		return (
			<View>
				<Text>Something Went Wrong! (props is undefined)</Text>
			</View>
		)
	}
	const { navigation } = props
	const { user, logout } = useKentKartAuthStore((state) => state)
	const [is_show_secret, setIsShowSecret] = useState(false)
	const { data: favoritesData, refetch: refetchFavorites, isRefetching: isFavoritesRefetching, isLoading: isFavoritesLoading, error: favoritesError } = useGetFavorites()
	return (
		<SeasonValidator>
			<KentKartAuthValidator else={<AuthWall navigation={navigation} />}>
				<ScrollView
					refreshControl={<RefreshControl onRefresh={refetchFavorites} refreshing={isFavoritesRefetching} />}
					horizontal={false}
					showsVerticalScrollIndicator={true}
					contentContainerStyle={{
						paddingBottom: 100,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: theme.dark,
					}}
					className="flex-1 h-full"
				>
					<AccountDetailsContainer show_credentials={is_show_secret} user={user} />
					{isFavoritesLoading ? (
						<View className="items-center flex-1 justify-center">
							<CustomLoadingIndicator />
							<Text
								style={{
									marginTop: 8 * 4,
									color: theme.secondary,
									fontWeight: "800",
									fontSize: 24,
								}}
							>
								Fetching Favorites...
							</Text>
						</View>
					) : (
						favoritesData?.data.cardlist?.filter((fav)=>fav).map((p_card, index) => (
							<CardContainer
								style={{
									marginTop: 5 * 4,
								}}
								index={index}
								key={"card_" + (p_card.aliasNo)}
								favorite_data={p_card}
								navigation={navigation}
							/>
						)) || (
							<View className="items-center flex-1 justify-center">
								<Text
									style={{
										marginTop: 8 * 4,
										color: theme.secondary,
										fontWeight: "800",
										fontSize: 24,
									}}
								>
									No cards found!
								</Text>
							</View>
						)
					)}

					{/* {favoritesData?.data.virtualCards?.map((p_card, index) => {
						console.log("virtual card",p_card)
						return (
						<CardContainer style={{ marginTop: 5 * 4 }} favorite_data={p_card} navigation={navigation} key={"virtual_card_" + (p_card.favorite + p_card.alias)} index={index} />
					)})} */}
					<AddCard />
					<SimplyButton onPress={logout} className="mb-2" text="Log Out" color={theme.error} size="medium" />
					<SimplyButton className="mt-4" text="Select City" size="medium" onPress={() => props.navigation.navigate("city_selector")} />
				</ScrollView>
			</KentKartAuthValidator>
		</SeasonValidator>
	)
}
