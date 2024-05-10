import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RefreshControl, ScrollView, Text, View } from "react-native"
import Application from "../common/Application"
import User from "../common/classes/User"
import AccountDetailsContainer from "../components/tab_components/account_details/AccountDetailsContainer"
import { useContext, useEffect, useState } from "react"

import CardContainer from "../components/tab_components/account_details/CardContainer"
import CustomLoadingIndicator from "../components/root/CustomLoadingIndicator"
import { Favorite, Favorites } from "../common/interfaces/KentKart/Favorite"
import { AddCard } from "../components/tab_components/account_details/AddCard"
import { UserContext, UserContextInterface } from "../common/contexts/UserContext"
import KentKartAuthValidator from "../components/validators/KentKartAuthValidator"
import AuthWall from "../components/walls/AuthWall"
export default function AccountTab(props?: { route: any; navigation: NativeStackNavigationProp<any> | any }) {
	if (!props) {
		return (
			<View>
				<Text>Something Went Wrong! (props is undefined)</Text>
			</View>
		)
	}
	const { navigation } = props

	const styles = Application.styles
	const { loggedUser: user, favoritesQuery, profileQuery } = useContext(UserContext) as Omit<UserContextInterface, "loggedUser"> & { loggedUser: User }
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
	const { data: favoritesData, refetch: refetchFavorites, isRefetching: isFavoritesRefetching, isLoading: isFavoritesLoading } = favoritesQuery
	useEffect(() => {
		if (!favoritesData?.data) {
			return
		}
		const favorite_cards_filtered = get_cards_from_fav_list(favoritesData.data.userFavorites)
		setCards(favorite_cards_filtered)
		setVirtualCards(favoritesData.data.virtualCards)
	}, [favoritesData?.data])
	return (
		<View style={{ backgroundColor: styles.dark }} className="flex-1 items-center justify-center">
			{/* login prompt */}
			<KentKartAuthValidator else={<AuthWall navigation={navigation} />}>
				<ScrollView
					refreshControl={<RefreshControl onRefresh={refetchFavorites} refreshing={isFavoritesLoading} />}
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
									color: Application.styles.secondary,
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
										color: Application.styles.secondary,
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
					{/* <TouchableOpacity
					className="justify-end"
					onPress={async () => {
						await Application.logout()
						navigation?.navigate("auth")
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
					<Text
						style={{ color: styles.white }}
						className="font-bold text-lg text-center"
					>
						Logout
					</Text>
				</TouchableOpacity> */}
				</ScrollView>
			</KentKartAuthValidator>
		</View>
	)
}
