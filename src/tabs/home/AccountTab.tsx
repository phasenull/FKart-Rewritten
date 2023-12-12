import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Image, RefreshControl, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import Application from "../../util/Application"
import User from "../../util/classes/User"
import AccountDetailsContainer from "../../components/containers/AccountDetailsContainer"
import { useMemo } from "react"
import CardTypes from "../../util/enums/CardTypes"
import CardImages from "../../util/enums/CardImages"
import Animated from "react-native-reanimated"

import { MaterialCommunityIcons } from "@expo/vector-icons"
export default function AccountTab(props: { route: any; navigation: NativeStackNavigationProp<any> }) {
	const { navigation } = props

	const styles = Application.styles
	const user: User = props.route.params?.user
	const cards = useMemo<Array<{ id: string; name: string; type: CardTypes; balance: number, loads:number }>>(() => {
		return [{ id: "666", name: "card.name", type: CardTypes.student, balance: -999, loads: 2 }]
	}, [])
	async function fetchData(user: User) {
		if (!user) {
			return
		}
	}
	return (
		<View style={{ backgroundColor: styles.dark }} className="flex-1 items-center justify-center">
			{/* login prompt */}
			<ScrollView
				refreshControl={<RefreshControl refreshing={false} />}
				horizontal={false}
				showsVerticalScrollIndicator={true}
				contentContainerStyle={{ marginVertical: 40, justifyContent: "center", alignItems: "center" }}
				className="w-full"
			>
				<AccountDetailsContainer user={user} />
				{cards.map((card, index) => {
					console.log(card)
					return (
						<TouchableOpacity
							activeOpacity={0.7}
							key={`card-${index}`}
							className="flex-row py-5 mt-10 px-5 w-80 h-32 rounded-[16px]"
							style={{ backgroundColor: styles.white, elevation: 10, shadowOffset: { height: 4, width: 4 } }}
						>
							<View className="w-24 -ml-5 mr-5 items-center justify-center">
								<Animated.Image
									className="h-28 mb-4 rotate-90"
									style={{ objectFit: "scale-down" }}
									sharedTransitionTag={`card-${index}`}
									source={CardImages[CardTypes[card.type as CardTypes]]}
								/>
							</View>
							{card.loads?<View className="absolute w-6 h-6 justify-center -right-1.5 -top-1.5 self-start rounded-full bg-red-400">
								<Text className="text-white text-center text-xl font-bold">{card.loads}</Text>
							</View>:null}
							<View className="flex-1 flex-row items-center justify-between">
								<View>
									<Text style={{ color: styles.primary }} className="flex-1 font-bold text-2xl text-left">
										{card.name}
									</Text>
									<Text style={{ color: styles.secondary }} className="flex-1 opacity-50 font-bold text-2xl text-left">
										{card.balance} TL
									</Text>
								</View>
								<View className="flex-1 items-end -mr-3 justify-center opacity-[0.15] ">
									<MaterialCommunityIcons color={styles.secondary} name="arrow-right-thick" style={{ width: 40 }} size={50} className="flex-1 " />
								</View>
							</View>
						</TouchableOpacity>
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
		</View>
	)
}
