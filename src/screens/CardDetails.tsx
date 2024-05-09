import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Clipboard, Image, RefreshControl, ScrollView, Text, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, Vibration, View } from "react-native"
import Application from "../common/Application"
import CardImages from "../common/enums/CardImages"
import CardTypes from "../common/enums/CardTypes"
import Animated, { Easing, FadeInDown, FadeInLeft, FadeOutUp, FlipInEasyX, FlipInEasyY, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import Card from "../common/classes/Card"
import React, { useEffect, useState } from "react"
import Logger from "../common/Logger"
import { LinearGradient } from "expo-linear-gradient"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { BasicCardData } from "../common/interfaces/KentKart/object/BasicCardData"
import { Favorite } from "../common/interfaces/KentKart/object/Favorite"

import { useGetSyncCode } from "../common/hooks/kentkart/user/useGetSyncCode"
import { getQRCode } from "../common/hooks/useGetQRCode"
import CustomLoadingIndicator from "../components/root/CustomLoadingIndicator"
import SelectCardTypeModal from "../components/screen_components/card_details/SelectCardTypeModal"
import CardDetailsHeader from "../components/screen_components/card_details/CardDetailsHeader"
import CardJSONData from "../components/screen_components/card_details/CardJSONData"
import VirtualCardQRCodePanel from "../components/screen_components/card_details/VirtualCardQRCodePanel"
import CardControlPanel from "../components/screen_components/card_details/CardControlPanel"
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
	const styles = Application.styles
	const [loading, setLoading] = useState(false)
	const favorite_data = props?.route.params?.favorite_data
	const card = props?.route.params?.card
	const is_virtual = props?.route.params?.is_virtual
	let syncData: undefined | { data: { cardInfo: { expireDate: string; token: string; aliasNo: string } } } = undefined
	if (is_virtual) {
		syncData = useGetSyncCode(card?.aliasNo || favorite_data?.favorite).data
	}
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
			headerTintColor: styles.white,
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
				<Text style={{ color: styles.error, fontSize: 24 }}>No card data found</Text>
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
					Application.database.set("card__" + card.aliasNo, value)
				}}
			/>
			<CardDetailsHeader card={card} card_type={card_type} setShowEditCardTypeModal={setShowEditCardTypeModal} />

			<CardControlPanel makeRefresh={() => {}} card={card} favorite_data={favorite_data} navigation={navigation} is_virtual={is_virtual} />

			{/* {card.virtualCard === "1" && cardToken ? (
				
			) : null} */}
			<VirtualCardQRCodePanel card={card} token={cardToken} />
			<CardJSONData card={card} favorite_data={favorite_data} />
		</ScrollView>
	)
}
