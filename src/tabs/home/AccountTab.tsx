import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import {
	Image,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import Application from "../../common/Application"
import User from "../../common/classes/User"
import AccountDetailsContainer from "../../components/account_details/AccountDetailsContainer"
import { useEffect, useMemo, useState } from "react"
import CardTypes from "../../common/enums/CardTypes"
import CardImages from "../../common/enums/CardImages"
import Animated, {
	FadeInDown,
	FadeInLeft,
	FadeInRight,
	SharedTransition,
	withSpring,
} from "react-native-reanimated"

import Card from "../../common/classes/Card"
import API from "../../common/API"
import CardContainer from "../../components/account_details/CardContainer"
import NotLoggedInModal from "../../components/auth/NotLoggedInModal"
import useGetProfileData from "../../common/hooks/useGetProfileData"
import useGetFavorites from "../../common/hooks/useGetFavorites"
import CustomLoadingIndicator from "../../components/CustomLoadingIndicator"
import {
	Favorite,
	Favorites,
} from "../../common/enums/Favorites"
import { AddCard } from "../../components/account_details/AddCard"
export default function AccountTab(props?: {
	route: any
	navigation: NativeStackNavigationProp<any> | any
}) {
	if (!props) {
		return (
			<View>
				<Text>Something Went Wrong</Text>
			</View>
		)
	}
	const { navigation } = props

	const styles = Application.styles
	const [user, setUser] = useState<User | null>(
		props.route.params?.user
	)
	// const card = useMemo(async () =>  {return await fetchData()}, [])
	const [cards, setCards] = useState<
		Favorite<"Card">[] | undefined
	>(undefined)
	const [virtualCards, setVirtualCards] = useState<
		Favorite<"QR">[] | undefined
	>(undefined)
	const {
		data: user_profile_data,
		isLoading,
		isError,
		error,
		refetch,
		isRefetching,
	} = useGetProfileData()
	const [is_show_secret, setIsShowSecret] = useState(false)

	function get_cards_from_fav_list(
		fav_list: any,
		is_from_cache: boolean = false
	) {
		if (!fav_list) {
			return []
		}
		const favorite_cards_filtered: Favorite<"Card">[] =
			fav_list?.filter(
				(p_card: Favorite<"Card">) => p_card.type === 2 || p_card.alias
			)
		return favorite_cards_filtered
	}
	const {
		data: favoritesData,
		error: favoritesError,
		refetch: refetchFavorites,
		isError: isFavoritesError,
		isRefetching: isFavoritesRefetching,
		isLoading: isFavoritesLoading,
	} = useGetFavorites()
	useEffect(() => {
		if (!favoritesData?.data) {
			return
		}
		const favorite_cards_filtered = get_cards_from_fav_list(
			favoritesData.data.userFavorites
		)
		setCards(favorite_cards_filtered)
		setVirtualCards(favoritesData.data.virtualCards)
	}, [favoritesData?.data])
	useEffect(() => {
		if (!user_profile_data?.data) {
			return
		}
		setUser(User.fromJSON(user_profile_data.data.accountInfo))
	}, [user_profile_data?.data])
	if (!user) {
		return (
			<NotLoggedInModal
				navigation={navigation}
				onRequestClose={() => {
					navigation?.navigate("auth")
				}}
				param_visible={true}
				key={"not_logged_in_modal"}
			/>
		)
	}
	if (isError || favoritesError) {
		return (
			<View>
				<Text>Something Went Wrong</Text>
			</View>
		)
	}
	if (isLoading || isFavoritesLoading) {
		return <CustomLoadingIndicator />
	}
	return (
		<View
			style={{ backgroundColor: styles.dark }}
			className="flex-1 items-center justify-center"
		>
			{/* login prompt */}
			<ScrollView
				refreshControl={
					<RefreshControl
						onRefresh={() => {
							setCards(undefined)
							setVirtualCards(undefined)
							refetch()
							refetchFavorites()
						}}
						refreshing={isLoading || isFavoritesLoading}
					/>
				}
				horizontal={false}
				showsVerticalScrollIndicator={true}
				contentContainerStyle={{
					paddingBottom: 100,
					justifyContent: "center",
					alignItems: "center",
				}}
				className="w-full"
			>
				<AccountDetailsContainer
					show_credentials={is_show_secret}
					user={user}
				/>
				{(isFavoritesLoading &&!isFavoritesRefetching) ? 
				<CustomLoadingIndicator size={16*4} style={{height:400}}/>
				: cards?.map((p_card, index) => (
					<CardContainer
						style={{ marginTop: 5 * 4 }}
						index={index}
						key={"card_" + index}
						favorite_data={p_card}
						navigation={navigation}
					/>
				)) || <CustomLoadingIndicator size={16*4} style={{height:400}}/>}

				{virtualCards?.map((p_card, index) => (
					<CardContainer
						style={{ marginTop: 5 * 4 }}
						favorite_data={p_card}
						navigation={navigation}
						key={"virtual_card_" + index}
						index={index}
					/>
				))}
				<AddCard/>
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
		</View>
	)
}
