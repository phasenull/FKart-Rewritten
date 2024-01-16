import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import {
	Clipboard,
	Image,
	RefreshControl,
	ScrollView,
	Text,
	ToastAndroid,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Vibration,
	View,
} from "react-native"
import Application from "../common/Application"
import CardImages from "../common/enums/CardImages"
import CardTypes from "../common/enums/CardTypes"
import Animated, {
	FadeInDown,
	FadeInLeft,
	FadeOutUp,
	FlipInEasyX,
	FlipInEasyY,
} from "react-native-reanimated"
import Card from "../common/classes/Card"
import React, { useEffect, useState } from "react"
import Logger from "../common/Logger"
import { LinearGradient } from "expo-linear-gradient"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { BasicCardData } from "../common/interfaces/BasicCardData"
import { Favorite } from "../common/enums/Favorites"
import CardControlPanel from "../components/card_details/CardControlPanel"
export default function CardDetails(props?: {
	route: {
		params?: {
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
	if (!card || !favorite_data) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text style={{ color: styles.warning, fontSize: 24 }}>
					No card data found
				</Text>
			</View>
		)
	}
	const { navigation } = props
	useEffect(() => {
		navigation.setOptions({
			headerTitle: `${
				favorite_data.description ||
				(is_virtual && "QR Kart") ||
				"unnamed card"
			}`,
			headerTintColor: styles.white,
			headerTitleAlign: "left",
			headerTitleStyle: {
				fontWeight: "bold",
			},
		})
	}, [])
	async function get() {
		if (!card) {
			return
		}
		// setLoading(true)
		// const new_card = new Card(card.alias)
		// await new_card.fetchData()
		// Logger.info(
		// 	"CardDetails.get",
		// 	`Fetched new card data for ${card.alias}}`
		// )
		// setLoading(false)
	}

	return (
		<Animated.ScrollView
			// tofix
			refreshControl={
				<RefreshControl
					refreshing={loading}
					onRefresh={() => {
						get()
					}}
				/>
			}
			className="flex-col"
			contentContainerStyle={{ alignItems: "center" }}
		>
			<LinearGradient
				colors={[styles.primary, styles.white]}
				end={{ x: 1.25, y: 1 }}
				className="flex-row h-56 w-full mb-20"
				style={{ backgroundColor: styles.primary }}
			>
				<Animated.View
					entering={FadeInLeft.duration(500)}
					className="flex-col flex-1 ml-5 self-end mb-4 "
				>
					<Text className="opacity-70 top-3 text-white text-xl">
						Bakiye
					</Text>
					<View className="flex-row items-baseline text-white gap-x-2 mb-4">
						<Text className="font-bold text-white text-[48px]">
							{card.balance}
						</Text>
						<Text className="text-[28px] text-white font-bold">TL</Text>
					</View>
					<TouchableOpacity
						onPress={() => {
							Clipboard.setString(card.aliasNo)
							ToastAndroid.show(
								"Kart numarası kopyalandı!",
								ToastAndroid.SHORT
							)
							// vibrate device
							Vibration.vibrate(100)
						}}
						onLongPress={() => {
							Clipboard.setString(card.aliasNo)
							ToastAndroid.show(
								"Kart numarası kopyalandı!",
								ToastAndroid.SHORT
							)
							// vibrate device
							Vibration.vibrate(100)
						}}
						className="flex-row w-full gap-x-1 items-center"
					>
						<View className="flex-col">
							<Text className="opacity-70 text-white text-xl">
								Kart Numarası
							</Text>
							<Text className="font-bold bottom-1 text-white text-xl">
								{card.aliasNo}
							</Text>
						</View>
						<MaterialCommunityIcons
							style={{ color: styles.white }}
							size={20}
							name="content-copy"
						/>
					</TouchableOpacity>
				</Animated.View>
				<Animated.View
					entering={FadeInDown.duration(500)}
					className="flex-1 mr-24"
				>
					<Image
						className={"relative w-64 h-64 left-4 -bottom-8 "}
						style={{
							transform: [{ rotateZ: "90deg" }],
							objectFit: "contain"
						}}
						source={{
							uri: Card.getImageFromType(is_virtual ? "QR" : "00"),
						}}
					/>
				</Animated.View>
			</LinearGradient>
			{/* <View>
				<Text style={{ color: styles.secondary }} className="mt-2 font-bold text-center text-[36px]">
					{card.balance} TL
					{card.loads_in_line ? (
						<View className="absolute w-6 h-6 justify-center  -top-1.5 self-start rounded-full bg-red-400">
							<Text className="text-white text-center text-xl font-bold">{card.loads_in_line?.length || "??"}</Text>
						</View>
					) : null}
				</Text>
				<Text style={{ color: styles.secondary }} className="opacity-20 mb-2 font-bold text-center text-xl">
					Tip: "{card.card_type || "undefined"}"
				</Text>
			</View> */}
			<CardControlPanel makeRefresh={()=>{}} card={card} favorite_data={favorite_data} navigation={navigation} is_virtual={is_virtual} />
			<Text
				className="p-4 mb-10 w-80"
				style={{
					backgroundColor: styles.dark,
					borderRadius: 16,
					elevation: 10,
					color: styles.secondaryDark,
				}}
			>
				Card Data: {JSON.stringify(card, null, 4)}
				{/* Loads in line: {JSON.stringify(card.loads_in_line, null, 4)} */}
			</Text>
		</Animated.ScrollView>
	)
}
