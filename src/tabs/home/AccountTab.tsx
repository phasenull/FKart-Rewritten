import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Image, RefreshControl, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import Application from "../../util/Application"
import User from "../../util/classes/User"
import AccountDetailsContainer from "../../components/containers/AccountDetailsContainer"
import { useEffect, useMemo, useState } from "react"
import CardTypes from "../../util/enums/CardTypes"
import CardImages from "../../util/enums/CardImages"
import Animated, { FadeInDown, FadeInLeft, FadeInRight, SharedTransition, withSpring } from "react-native-reanimated"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import Card from "../../util/classes/Card"
import { CARD_ALIAS } from "../../util/secret"
export default function AccountTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props

	const styles = Application.styles
	const user: User = props.route.params?.user
	const [loading, setLoading] = useState(false)
	// const card = useMemo(async () =>  {return await fetchData()}, [])
	const [card, setCard] = useState<Card | undefined>(undefined)
	useEffect(() => {
		get()
	}, [])

	async function get() {
		if (!user) {
			return
		}
		setLoading(true)
		const new_card = new Card(CARD_ALIAS)
		await new_card.fetchData()
		setCard(new_card)
		setTimeout(() => {
			setLoading(false)
		}, 100)
	}
	const transition = SharedTransition.custom((values) => {
		"worklet"
		return {
			height: withSpring(values.targetHeight),
			width: withSpring(values.targetWidth),
		}
	})
	return (
		<Animated.View entering={FadeInDown.duration(500)} style={{ backgroundColor: styles.dark }} className="flex-1 items-center justify-center">
			{/* login prompt */}
			<ScrollView
				refreshControl={
					<RefreshControl
						onRefresh={() => {
							setCard(undefined)
							get()
						}}
						refreshing={loading}
					/>
				}
				horizontal={false}
				showsVerticalScrollIndicator={true}
				contentContainerStyle={{ marginVertical: 40, justifyContent: "center", alignItems: "center" }}
				className="w-full"
			>
				<AccountDetailsContainer user={user} />
				{card &&
					[card].map((p_card, index) => {
						return (
							<Animated.View entering={FadeInRight} key={`card-${index}`}>
								<TouchableOpacity
									activeOpacity={0.7}
									className="flex-row py-5 mt-10 px-5 w-80 h-32 rounded-[16px]"
									style={{ backgroundColor: styles.white, elevation: 10, shadowOffset: { height: 4, width: 4 } }}
									onPress={() => {
										navigation.navigate("card_details", { card: p_card })
									}}
								>
									<View className="w-24 -ml-5 mr-5 items-center justify-center">
										<Animated.Image className="mb-4 rotate-90" style={{ height: 28 * 4, objectFit: "scale-down" }} source={p_card.getImage()} />
									</View>
									{p_card.loads_in_line ? (
										<View className="absolute w-6 h-6 justify-center -right-1.5 -top-1.5 self-start rounded-full bg-red-400">
											<Text className="text-white text-center text-xl font-bold">{p_card.loads_in_line?.length}</Text>
										</View>
									) : null}
									<View className="flex-1 flex-row items-center justify-between">
										<View>
											<Text style={{ color: styles.primary }} className="flex-1 font-bold text-2xl bottom-2 text-left">
												{p_card.description || "Adsız Kart"}
											</Text>
											<Text style={{ color: styles.white, backgroundColor: styles.secondary }} className="rounded-full mx-auto px-4 bottom-3 relative font-bold text-[12px] text-center">
												{p_card.alias || "key_error (alias)"} 
											</Text>
											<Text style={{ color: styles.secondary }} className="flex-1 opacity-50 font-bold text-2xl text-left">
												{p_card.balance || "key_error (balance)"} TL
											</Text>
										</View>
										<View className="flex-1 items-end -mr-3 justify-center opacity-[0.15] ">
											<MaterialCommunityIcons color={styles.secondary} name="arrow-right-thick" style={{ width: 40 }} size={50} className="flex-1 " />
										</View>
									</View>
								</TouchableOpacity>
							</Animated.View>
						)
					})}
				<TouchableOpacity
					className="justify-end"
					onPress={async () => {
						await Application.logout()
						navigation.navigate("auth")
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
					<Text style={{ color: styles.white }} className="font-bold text-lg text-center">
						Logout
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</Animated.View>
	)
}
