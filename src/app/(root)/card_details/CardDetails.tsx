import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import ApplicationConfig from "common/ApplicationConfig"
import Card from "common/classes/Card"
import CardTypes from "common/enums/CardTypes"
import { BasicCardData } from "common/interfaces/KentKart/BasicCardData"
import { Favorite, FavoritesV3Card } from "common/interfaces/KentKart/Favorite"
import React, { useContext, useEffect, useState } from "react"
import { RefreshControl, ScrollView, Text, View } from "react-native"

import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetABTSecret, useGetCardData, useGetTransactions } from "common/hooks/kentkart/cardHooks"
import { deltaTime } from "common/util"
import CardControlPanel from "./CardControlPanel"
import CardDetailsHeader from "./CardDetailsHeader"
import CardJSONData from "./CardJSONData"
import SelectCardTypeModal from "./SelectCardTypeModal"
import VirtualCardQRCodePanel from "./VirtualCardQRCodePanel"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
import { useGetCardType, useSetCardType } from "common/hooks/kentkart/nonAuthHooks"
import ErrorPage from "../ErrorPage"
import SecondaryText from "components/reusables/SecondaryText"
export default function CardDetails(props: {
	route: {
		params: {
			card: BasicCardData<"Basic" | "QR">
			favorite_data: FavoritesV3Card
			is_virtual?: boolean
		}
	}
	navigation: NativeStackNavigationProp<any>
}) {
	const { theme } = useContext(ThemeContext)
	const favorite_data = props?.route.params?.favorite_data
	const card = props?.route.params?.card
	const is_virtual = props?.route.params?.is_virtual
	const {
		data: transaction_data,
		refetch: refetchTransactions,
		isLoading: isLoadingTransactions,
	} = useGetTransactions({
		card_alias: card.aliasNo,
		term: { month: new Date().getMonth(), year: new Date().getFullYear() },
	})
	const { data: balanceData, refetch: refetchBalance, isLoading: isLoadingBalance } = useGetCardData({ card_alias: card.aliasNo })
	const {
		data: syncData,
		refetch: refetchABT,
		isLoading: isLoadingABT,
	} = useGetABTSecret({
		card_alias: card?.aliasNo,
	})
	const { data: card_type, refetch: refetchCardType } = useGetCardType(favorite_data.aliasNo)
	const { mutateAsync: mutateSetCardType } = useSetCardType()
	const { navigation } = props
	const [showEditCardTypeModal, setShowEditCardTypeModal] = useState(false)
	function refetchAll() {
		refetchABT()
		refetchBalance()
		refetchTransactions()
		refetchCardType()
	}
	if (!balanceData || !balanceData?.data || !balanceData?.data.cardlist || !balanceData?.data.cardlist[0]) {
		return <ErrorPage retry={refetchAll} error={{ title: "Error while fetching card data", description: `Server did not return a valid card data` }} />
	}
	const isOverallLoading = isLoadingABT || isLoadingBalance || isLoadingTransactions
	if (!card || !favorite_data || !card_type) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text style={{ color: theme.error, fontSize: 24 }}>No card data found</Text>
			</View>
		)
	}
	return (
		<ScrollView
			// tofix
			refreshControl={<RefreshControl refreshing={isOverallLoading} onRefresh={refetchAll} />}
			className="flex-col"
			contentContainerStyle={{ alignItems: "center" }}
		>
			<SelectCardTypeModal
				visible={showEditCardTypeModal}
				onDismiss={() => setShowEditCardTypeModal(false)}
				defaultValue={card_type}
				onSelect={(value) => {
					setShowEditCardTypeModal(false)
					mutateSetCardType({ alias_no: card.aliasNo, card_type: value }).then(() => refetchCardType())
				}}
			/>
			<CardDetailsHeader card={balanceData?.data.cardlist[0]} card_type={card_type} setShowEditCardTypeModal={setShowEditCardTypeModal} />
			<CardControlPanel makeRefresh={() => {}} card={card} favorite_data={favorite_data} navigation={navigation} is_virtual={is_virtual} />

			{/* <VirtualCardQRCodePanel card={card} token={{aliasNo:"hello","token":"hi","expireDate":""}} /> */}
			<CardJSONData card={{ ...card, ...balanceData?.data.cardlist[0] }} favorite_data={favorite_data} />
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
