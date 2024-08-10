import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import ApplicationConfig from "common/ApplicationConfig"
import Card from "common/classes/Card"
import CardTypes from "common/enums/CardTypes"
import { BasicCardData } from "common/interfaces/KentKart/BasicCardData"
import { Favorite } from "common/interfaces/KentKart/Favorite"
import React, { useContext, useEffect, useState } from "react"
import { RefreshControl, ScrollView, Text, View } from "react-native"

import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetABTSecret, useGetTransactions } from "common/hooks/kentkart/cardHooks"
import { deltaTime } from "common/util"
import CardControlPanel from "./CardControlPanel"
import CardDetailsHeader from "./CardDetailsHeader"
import CardJSONData from "./CardJSONData"
import SelectCardTypeModal from "./SelectCardTypeModal"
import VirtualCardQRCodePanel from "./VirtualCardQRCodePanel"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
export default function CardDetails(props: {
	route: {
		params: {
			card: BasicCardData<"Basic" | "QR">
			favorite_data: Favorite<"Card" | "QR">
			is_virtual?: boolean
		}
	}
	navigation: NativeStackNavigationProp<any>
}) {
	const { theme } = useContext(ThemeContext)
	const [loading, setLoading] = useState(false)
	const favorite_data = props?.route.params?.favorite_data
	const card = props?.route.params?.card
	const user = useKentKartAuthStore((state) => state.user)
	const is_virtual = props?.route.params?.is_virtual
	const { data: transaction_data } = useGetTransactions({
		card_alias: card.aliasNo,
		term: { month: new Date().getMonth(), year: new Date().getFullYear() },
	})
	const { data: syncData } = useGetABTSecret({
		card_alias: card?.aliasNo || favorite_data?.favorite,
	})
	const [cardToken, setCardToken] = useState<undefined | { expireDate: string; token: string; aliasNo: string }>(undefined)
	const { navigation } = props
	const [card_type, setCardType] = useState(CardTypes.undefined)
	const [showEditCardTypeModal, setShowEditCardTypeModal] = useState(false)
	useEffect(() => {
		async function get() {
			setCardType(await Card.getTypeFromCard({ ...card, ...favorite_data }))
		}
		get()
		navigation.setOptions({
			headerTitle: `${favorite_data.description || (is_virtual && "QR Kart") || "unnamed card"}`,
			headerTintColor: theme.white,
			headerTitleAlign: "left",
			headerTitleStyle: {
				fontWeight: "bold",
			},
		})
	}, [card_type])
	useEffect(() => {
		if (!syncData || !syncData.data) {
			return
		}
		if (syncData?.data?.cardInfo?.token) {
			setCardToken(syncData?.data.cardInfo)
		}
	}, [syncData?.data])
	if (!card || !favorite_data) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text style={{ color: theme.error, fontSize: 24 }}>No card data found</Text>
			</View>
		)
	}
	return (
		<ScrollView
			// tofix
			refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {}} />}
			className="flex-col"
			contentContainerStyle={{ alignItems: "center" }}
		>
			<SelectCardTypeModal
				visible={showEditCardTypeModal}
				onDismiss={() => setShowEditCardTypeModal(false)}
				defaultValue={card_type}
				onSelect={(value) => {
					setShowEditCardTypeModal(false)
					setCardType(value)
					ApplicationConfig.database.set("card__" + card.aliasNo, value)
				}}
			/>
			<CardDetailsHeader card={card} card_type={card_type} setShowEditCardTypeModal={setShowEditCardTypeModal} />

			<CardControlPanel makeRefresh={() => {}} card={card} favorite_data={favorite_data} navigation={navigation} is_virtual={is_virtual} />

			{/* {card.virtualCard === "1" && cardToken ? (
				
			) : null} */}
			<VirtualCardQRCodePanel card={card} token={cardToken} />
			<CardJSONData card={card} favorite_data={favorite_data} />
			<CardJSONData
				card={transaction_data?.data?.transactionList?.map(
					(e) =>
						`${Date.now() - e.unixtime * 1000 < 24 * 60 * 60 * 1_000 ? deltaTime(Date.now() - e.unixtime * 1000) : new Date(e.unixtime * 1000).toLocaleDateString()}        ${e.type === "0" ? "+" : "-"} ${
							e.amount || e.usageAmt
						}`
				)}
			/>
		</ScrollView>
	)
}
