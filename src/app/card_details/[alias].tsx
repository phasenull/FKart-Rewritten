import CardTypes from "common/enums/CardTypes"
import React, { useContext, useState } from "react"
import { RefreshControl, ScrollView, Text, View } from "react-native"

import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetABTSecret, useGetCardData, useGetTransactions } from "common/hooks/kentkart/cardHooks"
import { useGetCardType, useSetCardType } from "common/hooks/kentkart/nonAuthHooks"
import { deltaTime } from "common/util"
import CardControlPanel from "components/card_details/CardControlPanel"
import CardDetailsHeader from "components/card_details/CardDetailsHeader"
import CardJSONData from "components/card_details/CardJSONData"
import SelectCardTypeModal from "components/card_details/SelectCardTypeModal"
import { Stack, useLocalSearchParams } from "expo-router"
import ErrorPage from "../ErrorPage"
import TransactionTouchable from "components/card_details/TransactionTouchable"
export default function CardDetails() {
	const { theme } = useContext(ThemeContext)
	const { alias, description } = useLocalSearchParams<{ alias: string; description?: string }>()
	const {
		data: transaction_data,
		refetch: refetchTransactions,
		isLoading: isLoadingTransactions,
	} = useGetTransactions({
		card_alias: alias,
		term: { month: new Date().getMonth(), year: new Date().getFullYear() },
	})
	const { data: balanceData, refetch: refetchBalance, isLoading: isLoadingBalance } = useGetCardData({ card_alias: alias })
	const {
		data: syncData,
		refetch: refetchABT,
		isLoading: isLoadingABT,
	} = useGetABTSecret({
		card_alias: alias,
	})
	const { data: card_type, refetch: refetchCardType } = useGetCardType(alias)
	const { mutateAsync: mutateSetCardType } = useSetCardType()
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
	if (!(alias || balanceData || card_type)) {
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
			<Stack.Screen
				options={{
					title: description || `Kart: ${alias}`,
					headerTitleStyle: { color: theme.text.white },
					headerTintColor: theme.text.white,
					headerTransparent: true,
					headerShown: true,
				}}
			/>
			<SelectCardTypeModal
				visible={showEditCardTypeModal}
				onDismiss={() => setShowEditCardTypeModal(false)}
				defaultValue={card_type as CardTypes}
				onSelect={(value) => {
					setShowEditCardTypeModal(false)
					mutateSetCardType({ alias_no: alias, card_type: value }).then(() => refetchCardType())
				}}
			/>
			<CardDetailsHeader card={balanceData?.data.cardlist[0]} card_type={card_type as CardTypes} setShowEditCardTypeModal={setShowEditCardTypeModal} />
			<CardControlPanel makeRefresh={() => {}} card={{aliasNo:alias} as any} is_virtual={alias.startsWith("33")} />

			{/* <VirtualCardQRCodePanel card={card} token={{aliasNo:"hello","token":"hi","expireDate":""}} /> */}
			<CardJSONData card={{ ...balanceData?.data.cardlist[0],_card_type:card_type||null }} />
			{transaction_data?.data?.transactionList?.map((transaction,i)=><TransactionTouchable transaction={transaction} key={`${i}`}/>)}
		</ScrollView>
	)
}
