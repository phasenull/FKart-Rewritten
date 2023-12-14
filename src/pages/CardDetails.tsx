import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RefreshControl, ScrollView, Text, View } from "react-native"
import Application from "../util/Application"
import CardImages from "../util/enums/CardImages"
import CardTypes from "../util/enums/CardTypes"
import Animated, { FlipInEasyX, FlipInEasyY } from "react-native-reanimated"
import Card from "../util/classes/Card"
import { useState } from "react"

export default function CardDetails(props?: { route: { params?: { card?: Card } }; navigation: NativeStackNavigationProp<any> }) {
	const styles = Application.styles
	const [loading, setLoading] = useState(false)
	if (!props?.route?.params?.card) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text style={{ color: styles.warning, fontSize: 24 }}>No card data found</Text>
			</View>
		)
	}
	const [card,setCard] = useState<Card>(props.route.params.card)
	async function get() {
		if (!card) {
			return
		}
		setLoading(true)
		const new_card = new Card(card.alias)
		await new_card.fetchData()
		setCard(new_card)
		setLoading(false)
	}
	return (
		<ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={()=>{get()}}/>} className="flex-col" contentContainerStyle={{ alignItems: "center"}}>
			<View className="flex-col items-center w-80">
				<Animated.Image
					entering={FlipInEasyX.duration(500).delay(250)}
					style={{
						objectFit: "contain",
					}}
					source={card.getImage()}
				/>
				<Text style={{ color: styles.primaryDark }} className="-mt-6 rounded-full px-3 py-0.5 font-bold text-center text-2xl">
					{card.description || "unnamed card"}
				</Text>
				<Text style={{ color: styles.white, backgroundColor: styles.secondary }} className="mt-1 font-bold rounded-full px-3 py-0.5 text-center text-lg">
					{card.alias}
				</Text>
			</View>
			<View>
				<Text style={{ color: styles.secondary }} className="mt-2 font-bold text-center text-[36px]">
					{card.balance} TL
					{!card.loads_in_line ? (
						<View className="absolute w-6 h-6 justify-center  -top-1.5 self-start rounded-full bg-red-400">
							<Text className="text-white text-center text-xl font-bold">{card.loads_in_line?.length || "??"}</Text>
						</View>
					) : null}
				</Text>
				<Text style={{ color: styles.secondary }} className="opacity-20 mb-2 font-bold text-center text-xl">
					Tip: "{card.card_type || "undefined"}"
				</Text>
			</View>
			<Text className="p-4 mb-10" style={{backgroundColor:styles.dark, borderRadius:10, elevation:10, color:styles.secondaryDark}}>Card Data: {JSON.stringify(card, null, 4)}</Text>
		</ScrollView>
	)
}
