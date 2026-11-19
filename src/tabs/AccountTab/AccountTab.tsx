import { useContext, useState } from "react"
import { RefreshControl, ScrollView, Text, View } from "react-native"
import AccountDetailsContainer from "./components/AccountDetailsContainer"

import { AddCard } from "./components/AddCard"
import CardContainer from "./components/CardContainer"

import { ThemeContext } from "common/contexts/ThemeContext"
import useGetFavorites from "common/hooks/kentkart/user/useGetFavorites"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import SimplyButton from "components/ui/SimplyButton"
import { useIsSignedIn } from "common/hooks/auth/useRequireAuth"
import { checkForUpdates } from "common/updates"
import SignInPrompt from "components/walls/SignInPrompt"
import { router } from "expo-router"
export default function AccountTab(props?: { route: any}) {
	const { theme } = useContext(ThemeContext)
	if (!props) {
		return (
			<View>
				<Text>Something Went Wrong! (props is undefined)</Text>
			</View>
		)
	}
	const { user, logout } = useKentKartAuthStore((state) => state)
	// incognito: the tab stays usable (city, updates, app data); account parts ask for a sign in
	const signedIn = useIsSignedIn()
	const [is_show_secret, setIsShowSecret] = useState(false)
	const { data: favoritesData, refetch: refetchFavorites, isRefetching: isFavoritesRefetching, isLoading: isFavoritesLoading, error: favoritesError } = useGetFavorites()
	return (
			<>
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
					{signedIn ? <AccountDetailsContainer show_credentials={is_show_secret} user={user} /> : null}
					{!signedIn ? (
						<SignInPrompt
							style={{ marginTop: 5 * 4, marginHorizontal: 16, alignSelf: "stretch" }}
							icon="card-account-details-outline"
							title="KentKart account"
							description="Sign in to see and add your cards. Everything else works without an account."
						/>
					) : isFavoritesLoading ? (
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
						<CardContainer style={{ marginTop: 5 * 4 }} favorite_data={p_card} key={"virtual_card_" + (p_card.favorite + p_card.alias)} index={index} />
					)})} */}
					{signedIn ? <AddCard /> : null}
					{signedIn ? <SimplyButton onPress={logout} className="mb-2" text="Log Out" color={theme.error} size="medium" /> : null}
					<SimplyButton className="mt-4" text="Select City" size="medium" onPress={() => router.navigate("/city_selector")} />
					<SimplyButton className="mt-4" text="Check for updates" size="medium" type="secondary" onPress={checkForUpdates} />
					<SimplyButton className="mt-4" text="App data" size="medium" type="secondary" onPress={() => router.navigate("/AppData")} />
				</ScrollView>
			</>
	)
}
