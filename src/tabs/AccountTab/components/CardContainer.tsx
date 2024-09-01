import Card from "common/classes/Card"
import { Text, ToastAndroid, TouchableOpacity, Vibration, View, ViewStyle } from "react-native"
import Animated, { FadeInRight } from "react-native-reanimated"

import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetCardData, useRemoveFavoriteCard } from "common/hooks/kentkart/cardHooks"
import useGetFavorites from "common/hooks/kentkart/user/useGetFavorites"
import { ITicket } from "common/interfaces/KentKart/BasicCardData"
import { FavoritesV3Card } from "common/interfaces/KentKart/Favorite"
import KkDate from "common/kk-date"
import { deltaTime, formatAlias } from "common/util"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import Divider from "components/reusables/Divider"
import { useContext } from "react"
import { Clipboard } from "react-native"
import { Swipeable } from "react-native-gesture-handler"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useQuery } from "react-query"
import { useGetCardType } from "common/hooks/kentkart/nonAuthHooks"
import CardImages from "common/enums/CardImages"
import ErrorPage from "app/ErrorPage"
import { router } from "expo-router"
interface Props {
	favorite_data: FavoritesV3Card
	index: number
	style?: ViewStyle
}
export default function CardContainer(props: Props) {
	const { favorite_data } = props
	const { data: freshData, isLoading, isRefetching, isError, error } = useGetCardData({ card_alias: favorite_data.aliasNo })
	const { mutateAsync: mutateRemove } = useRemoveFavoriteCard()
	const { refetch: refetchAccountFavorites } = useGetFavorites()
	const { data: dataCardType, isLoading: cardImageisLoading } = useGetCardType(favorite_data?.aliasNo)
	const { theme } = useContext(ThemeContext)
	if (isError) {
		console.warn("CardContainer error", (error as any)?.message)
		return (
			<View>
				<Text>{(error as any)?.message}</Text>
			</View>
		)
	}
	const card_data = freshData?.data?.cardlist?.at(0)
	return (
		<Animated.View
			entering={FadeInRight}
			style={{
				...props.style,
			}}
			key={`card-${favorite_data?.aliasNo}`}
		>
			<Swipeable
				containerStyle={{
					overflow: "visible",
				}}
				friction={1}
				failOffsetX={20}
				overshootRight={false}
				renderRightActions={() => (
					<TouchableOpacity
						className="justify-center self-center items-center"
						style={{
							backgroundColor: theme.error,
							elevation: 10,
							borderRadius: 100,
							width: 16 * 4,
							height: 16 * 4,
							padding: 4,
							marginHorizontal: 10,
						}}
						onPress={() => {
							if (favorite_data.aliasNo) {
								mutateRemove({ alias_no: favorite_data.aliasNo }).then(() => refetchAccountFavorites())
							}
						}}
					>
						<MaterialCommunityIcons color={theme.white} name="trash-can" size={44} />
					</TouchableOpacity>
				)}
			>
				<TouchableOpacity
					activeOpacity={0.8}
					className="items-center flex-row py-5 px-5 w-80 h-32 rounded-[16px]"
					disabled={isLoading}
					style={{
						backgroundColor: theme.white,
						shadowOffset: { height: 4, width: 4 },
					}}
					onPress={() => {
						router.push({pathname:`/card_details/[alias]`,params:{alias:favorite_data.aliasNo,description:favorite_data.description}})
					}}
					onLongPress={() => {
						Clipboard.setString(favorite_data.aliasNo)
						ToastAndroid.show("Kart numarası kopyalandı!", ToastAndroid.SHORT)
						// vibrate device
						Vibration.vibrate(100)
					}}
				>
					<View className="w-28 h-36 top-1 -ml-12 mr-1 items-center justify-center">
						{!cardImageisLoading && dataCardType ? (
							<Animated.Image
								className="h-64 rotate-90"
								style={{ width: 4 * 40, objectFit: "contain" }}
								source={{
									uri: CardImages[dataCardType],
								}}
							/>
						) : (
							<CustomLoadingIndicator />
						)}
					</View>
					{card_data?.loads_in_line || card_data?.oChargeList ? (
						<View className="absolute w-6 h-6 justify-center -right-1.5 -top-1.5 self-start rounded-full bg-red-400">
							<Text className="text-white text-center text-xl font-bold">{(card_data?.loads_in_line || card_data?.oChargeList)?.length}</Text>
						</View>
					) : null}
					<View className="flex-1 w-full flex-row space-x-2 items-center">
						<Divider height={25 * 4} />
						<View className="flex-col">
							<Text numberOfLines={1} style={{ color: theme.primary }} className="flex-1 text-2xl font-bold w-full bottom-2 text-left">
								{favorite_data.description || (card_data?.virtualCard && "QR Kart") || "Adsız Kart"}
							</Text>
							<Text
								style={{
									color: theme.white,
									backgroundColor: theme.secondary,
									width: 30 * 4,
								}}
								className="rounded-full mt-3 px-4 bottom-5 relative justify-center font-bold text-[12px] text-center"
							>
								{formatAlias(favorite_data?.aliasNo) || "key_error (favorite)"}
							</Text>
							{card_data ? (
								<View className="flex-1 flex-row">
									<Text adjustsFontSizeToFit={true} style={{ color: theme.secondary, fontSize: 34, textAlignVertical: "bottom" }} className="opacity-50 font-bold text-left">
										{card_data.balance || "key_error (balance)"} TL
									</Text>
									{isLoading || isRefetching ? <CustomLoadingIndicator color={theme.secondary} style={{ marginLeft: 10 }} size={15} /> : null}
								</View>
							) : (
								<CustomLoadingIndicator color={theme.secondary} size={20} />
							)}
						</View>
						<View className=" items-end flex-1 flex-col space-y-2">
							{card_data?.ticketList
								?.sort((a, b) => {
									let time_a
									let time_b
									try {
										time_a = new KkDate(a.expiryDate).getTime() as number
										time_b = new KkDate(b.expiryDate).getTime() as number
									} catch {
										time_a = 0
										time_b = 0
									}
									return time_a - time_b || 0
								})
								.slice(0, 5)
								.map((ticket) => (
									<RemainingTicketContainer key={ticket.ticketNo} ticket={ticket} />
								))}
						</View>
					</View>
				</TouchableOpacity>
			</Swipeable>
		</Animated.View>
	)
}
function RemainingTicketContainer(props: { ticket: ITicket }) {
	const { ticket } = props
	const { theme } = useContext(ThemeContext)
	let expiryDate
	try {
		expiryDate = new KkDate(ticket.expiryDate).getTime() as number
	} catch (e) {
		console.warn("Error while parsing ticket expiry date:", ticket.expiryDate, e)
	}
	if (!expiryDate) return
	const remainingText = expiryDate - Date.now() < 7 * 24 * 60 * 60 * 1000 ? deltaTime(expiryDate - Date.now(), true) : undefined
	if (remainingText) {
		return (
			<View className="mt-1">
				<Text
					numberOfLines={1}
					className="absolute z-20 -top-3 -right-3 self-end h-full text-center rotate-[10deg]"
					style={{
						color: theme.text.secondary,
						fontWeight: "600",
					}}
				>
					{/* {remainingText.split(" ")[0] + remainingText.split(" ")[1].slice(0, 1)} */}
					{remainingText === "now" ? "expired!" : remainingText}
				</Text>
				<Text
					className="h-6 w-12 text-center"
					numberOfLines={1}
					style={{
						backgroundColor: theme.error,
						borderRadius: 6,
						fontSize: 18,
						fontWeight: "500",
						color: theme.white,
					}}
				>
					{ticket.remainingCount}
				</Text>
			</View>
		)
	}
	return (
		<Text
			className="h-6 w-12 text-center mt-1"
			numberOfLines={1}
			style={{
				backgroundColor: theme.primary,
				borderRadius: 6,
				fontSize: 18,
				fontWeight: "500",
				color: theme.text.white,
			}}
		>
			{ticket.remainingCount}
		</Text>
	)
}
