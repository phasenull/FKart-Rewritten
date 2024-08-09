import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import AccountDetailsContainer from "components/tab_components/account_details/AccountDetailsContainer"
import { useContext, useEffect, useState } from "react"
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native"

import { Favorite } from "common/interfaces/KentKart/Favorite"
import { AddCard } from "components/tab_components/account_details/AddCard"
import CardContainer from "components/tab_components/account_details/CardContainer"

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
	const [cards, setCards] = useState<Favorite<"Card">[] | undefined>(undefined)
	const [virtualCards, setVirtualCards] = useState<Favorite<"QR">[] | undefined>(undefined)
	const [is_show_secret, setIsShowSecret] = useState(false)
	function get_cards_from_fav_list(fav_list: any, is_from_cache: boolean = false) {
		if (!fav_list) {
			return []
		}
		const favorite_cards_filtered: Favorite<"Card">[] = fav_list?.filter((p_card: Favorite<"Card">) => p_card.type === 2 || p_card.alias)
		return favorite_cards_filtered
	}
	const { data: favoritesData, refetch: refetchFavorites, isRefetching: isFavoritesRefetching, isLoading: isFavoritesLoading, error: favoritesError } = useGetFavorites()
	useEffect(() => {
		if (!favoritesData?.data) {
			return
		}
		const favorite_cards_filtered = get_cards_from_fav_list(favoritesData.data.userFavorites)
		setCards(favorite_cards_filtered)
		setVirtualCards(favoritesData.data.virtualCards)
	}, [favoritesData?.data])
	return (
		<SeasonValidator>
			<View style={{ backgroundColor: theme.dark }} className="flex-1 items-center justify-center">
				{/* login prompt */}
				<KentKartAuthValidator else={<AuthWall navigation={navigation} />}>
					<ScrollView
						refreshControl={<RefreshControl onRefresh={refetchFavorites} refreshing={isFavoritesRefetching} />}
						horizontal={false}
						showsVerticalScrollIndicator={true}
						contentContainerStyle={{
							paddingBottom: 100,
							justifyContent: "center",
							alignItems: "center",
						}}
						className="w-full"
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
							cards?.map((p_card, index) => (
								<CardContainer
									style={{
										marginTop: 5 * 4,
									}}
									index={index}
									key={"card_" + index}
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

						{virtualCards?.map((p_card, index) => (
							<CardContainer style={{ marginTop: 5 * 4 }} favorite_data={p_card} navigation={navigation} key={"virtual_card_" + index} index={index} />
						))}
						<AddCard />
						<SimplyButton onPress={logout} className="mb-2" text="Log Out" color={theme.error} size="medium" />
						<SimplyButton className="mt-4" text="Select City" size="medium" onPress={() => props.navigation.navigate("city_selector")} />
					</ScrollView>
				</KentKartAuthValidator>
			</View>
		</SeasonValidator>
	)
}
