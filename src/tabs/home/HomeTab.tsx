import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetCardData, useGetTransactions } from "common/hooks/kentkart/cardHooks"
import { useGetAnnouncements } from "common/hooks/kentkart/nonAuthHooks"
import useGetFavorites from "common/hooks/kentkart/user/useGetFavorites"
import useGetProfileData from "common/hooks/kentkart/user/useGetProfileData"
import CardTransaction from "common/interfaces/KentKart/CardTransaction"
import { deltaTime } from "common/util"
import { useWays } from "common/ways"
import WayCard from "components/home/WayCard"
import CardJSONData from "components/card_details/CardJSONData"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import KentKartAuthValidator from "components/validators/KentKartAuthValidator"
import AuthWall from "components/walls/AuthWall"
import { router } from "expo-router"
import { useContext, useState } from "react"
import { Modal, Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native"
import ApplicationConfig from "common/ApplicationConfig"
import { FavoritesV3Card } from "common/interfaces/KentKart/Favorite"
import { formatAlias } from "common/util"
import { useQuery, useQueryClient } from "react-query"

type Filter = "all" | "ways" | "card" | "news"

function SectionLabel(props: { text: string }) {
	const { theme } = useContext(ThemeContext)
	return <Text style={{ color: theme.secondary, opacity: 0.5, fontWeight: "800", fontSize: 12, letterSpacing: 0.5, marginTop: 6 }}>{props.text}</Text>
}

function ToolRow(props: { icon: string; title: string; description: string; onPress: () => void; last?: boolean }) {
	const { theme } = useContext(ThemeContext)
	return (
		<TouchableOpacity
			onPress={props.onPress}
			style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: props.last ? 0 : 1, borderColor: "#f0f0f0" }}
		>
			<MaterialCommunityIcons name={props.icon as any} size={26} color={theme.primaryDark} />
			<View style={{ flex: 1 }}>
				<Text style={{ color: theme.secondary, fontWeight: "800", fontSize: 14 }}>{props.title}</Text>
				<Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "600", fontSize: 12 }}>{props.description}</Text>
			</View>
			<MaterialCommunityIcons name="chevron-right" size={22} color={theme.secondary} />
		</TouchableOpacity>
	)
}

function CardActivity(props: { alias: string }) {
	const { theme } = useContext(ThemeContext)
	const now = new Date()
	const { data, isLoading } = useGetTransactions({ card_alias: props.alias, term: { month: now.getMonth(), year: now.getFullYear() } })
	const list = ((data?.data?.transactionList || []) as CardTransaction<any>[])
		.slice()
		.sort((a, b) => (b.unixtime || 0) - (a.unixtime || 0))
		.slice(0, 4)
	if (isLoading) return <CustomLoadingIndicator size={20} />
	if (!list.length) return <Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "700", padding: 14 }}>No card activity this month</Text>
	return (
		<View>
			{list.map((e, i) => {
				const is_ride = e.type === "1"
				const amount = is_ride ? e.usageAmt : e.amount
				const when = e.unixtime ? deltaTime(Date.now() - e.unixtime * (e.unixtime < 1e12 ? 1000 : 1)) : e.formattedDate
				return (
					<View
						key={`tx-${i}`}
						style={{ flexDirection: "row", alignItems: "center", minHeight: 44, paddingHorizontal: 14, borderBottomWidth: i === list.length - 1 ? 0 : 1, borderColor: "#f0f0f0", gap: 8 }}
					>
						<MaterialCommunityIcons name={is_ride ? "arrow-top-right" : "arrow-bottom-left"} size={18} color={is_ride ? theme.error : theme.success} />
						<Text style={{ color: theme.secondary, fontWeight: "800", fontSize: 14, flex: 1 }}>{is_ride ? "Ride" : "Top up"}</Text>
						<Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "700", fontSize: 12 }}>{when}</Text>
						<Text style={{ color: is_ride ? theme.secondary : theme.success, fontWeight: "800", fontSize: 14, minWidth: 64, textAlign: "right" }}>
							{is_ride ? "−" : "+"}
							{amount || "0.00"}
						</Text>
					</View>
				)
			})}
		</View>
	)
}

const HOME_CARD_KEY = "home.card_alias"

/** balance chip at the top right; tapping it opens the card picker */
function BalanceChip(props: { alias: string; onPress: () => void }) {
	const { theme } = useContext(ThemeContext)
	const { data } = useGetCardData({ card_alias: props.alias })
	const balance = data?.data?.cardlist?.at(0)?.balance
	return (
		<TouchableOpacity
			onPress={props.onPress}
			accessibilityLabel="Choose which card shows here"
			style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: theme.white, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8, elevation: 2 }}
		>
			<MaterialCommunityIcons name="card-bulleted-outline" size={20} color={theme.primaryDark} />
			<Text style={{ color: theme.secondary, fontWeight: "800", fontSize: 14 }}>{balance ? `${balance} TL` : "…"}</Text>
			<MaterialCommunityIcons name="chevron-down" size={18} color={theme.secondary} />
		</TouchableOpacity>
	)
}

function CardPickRow(props: { card: FavoritesV3Card; selected: boolean; onPick: () => void; onOpen: () => void }) {
	const { theme } = useContext(ThemeContext)
	const { data } = useGetCardData({ card_alias: props.card.aliasNo })
	const fresh = data?.data?.cardlist?.at(0)
	return (
		<View style={{ flexDirection: "row", alignItems: "center", borderRadius: 14, backgroundColor: props.selected ? "#FFF8D1" : theme.white, borderWidth: 2, borderColor: props.selected ? theme.primary : "transparent" }}>
			<TouchableOpacity onPress={props.onPick} style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 12 }}>
				<MaterialCommunityIcons name={props.selected ? "radiobox-marked" : "radiobox-blank"} size={22} color={theme.secondary} />
				<View style={{ flex: 1 }}>
					<Text numberOfLines={1} style={{ color: theme.secondary, fontWeight: "800", fontSize: 15 }}>
						{props.card.description || (fresh?.virtualCard === "1" ? "QR Kart" : "Adsız Kart")}
					</Text>
					<Text numberOfLines={1} style={{ color: theme.secondary, opacity: 0.6, fontWeight: "700", fontSize: 12 }}>
						{formatAlias(props.card.aliasNo)}
						{fresh?.paxDescription ? ` · ${fresh.paxDescription}` : ""}
					</Text>
				</View>
				<Text style={{ color: theme.secondary, fontWeight: "800", fontSize: 15 }}>{fresh?.balance ? `${fresh.balance} TL` : ""}</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={props.onOpen} accessibilityLabel="Open card details" style={{ width: 48, height: 56, alignItems: "center", justifyContent: "center" }}>
				<MaterialCommunityIcons name="chevron-right" size={24} color={theme.secondary} />
			</TouchableOpacity>
		</View>
	)
}

export default function HomeTab(props: { route: any }) {
	const { theme } = useContext(ThemeContext)
	const [filter, setFilter] = useState<Filter>("all")
	const [openNews, setOpenNews] = useState<number | undefined>()
	const { data: profile, isLoading, refetch: refetchProfile, isRefetching } = useGetProfileData()
	const { data: favorites, refetch: refetchFavorites } = useGetFavorites()
	const { data: ways, refetch: refetchWays } = useWays()
	const { data: announcements, refetch: refetchAnnouncements } = useGetAnnouncements()
	const credentials = useKentKartAuthStore((state) => state.credentials)
	const queryClient = useQueryClient()
	const [pickerOpen, setPickerOpen] = useState(false)
	// which card shows at the top right (and in card activity); saved on the phone
	const { data: savedCard } = useQuery([HOME_CARD_KEY], async () => ((await ApplicationConfig.database.get(HOME_CARD_KEY)) as string) || null, { staleTime: Infinity })
	const cards = (favorites?.data?.cardlist || []) as FavoritesV3Card[]
	const first_card = cards.find((e) => e.aliasNo === savedCard)?.aliasNo || cards.at(0)?.aliasNo
	async function pickCard(alias: string) {
		await ApplicationConfig.database.set(HOME_CARD_KEY, alias)
		queryClient.setQueryData([HOME_CARD_KEY], alias)
		setPickerOpen(false)
	}
	const news = announcements?.data?.announceList || []
	if (isLoading) {
		return <CustomLoadingIndicator />
	}
	const show = (key: Filter) => filter === "all" || filter === key
	const card = { backgroundColor: theme.white, borderRadius: 16, elevation: 2 }
	const chips: { key: Filter; label: string }[] = [
		{ key: "all", label: "All" },
		{ key: "ways", label: "Ways" },
		{ key: "card", label: "Card" },
		{ key: "news", label: news.length ? `News ${news.length}` : "News" },
	]
	return (
		<KentKartAuthValidator else={<AuthWall />}>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={isRefetching}
						onRefresh={() => {
							refetchProfile()
							refetchFavorites()
							refetchWays()
							refetchAnnouncements()
						}}
					/>
				}
				style={{ backgroundColor: theme.dark }}
				contentContainerStyle={{ padding: 16, paddingTop: 24, gap: 12 }}
			>
				<View className="flex-row items-center justify-between">
					<View style={{ flex: 1 }}>
						<Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "700", fontSize: 13 }}>Hello,</Text>
						<Text numberOfLines={1} style={{ color: theme.secondary, fontWeight: "800", fontSize: 24 }}>
							{profile?.data?.accountInfo?.name || ""}
						</Text>
					</View>
					{first_card ? <BalanceChip alias={first_card} onPress={() => setPickerOpen(true)} /> : null}
				</View>

				<View className="flex-row" style={{ gap: 8 }}>
					{chips.map((chip) => (
						<TouchableOpacity
							key={chip.key}
							onPress={() => setFilter(chip.key)}
							style={{ height: 34, paddingHorizontal: 14, borderRadius: 17, justifyContent: "center", backgroundColor: filter === chip.key ? theme.secondary : theme.white }}
						>
							<Text style={{ fontWeight: "800", fontSize: 13, color: filter === chip.key ? theme.white : theme.secondary }}>{chip.label}</Text>
						</TouchableOpacity>
					))}
				</View>

				{show("ways") ? (
					<View style={{ gap: 10 }}>
						<SectionLabel text="MY WAYS" />
						{(ways || []).map((way) => (
							<WayCard key={way.id} way={way} />
						))}
						<TouchableOpacity
							onPress={() => router.navigate("/way_editor")}
							style={{ height: 48, borderRadius: 16, borderWidth: 2, borderStyle: "dashed", borderColor: "#c4c9d2", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}
						>
							<MaterialCommunityIcons name="plus" size={20} color={theme.secondary} />
							<Text style={{ color: theme.secondary, fontWeight: "800", fontSize: 14 }}>{ways?.length ? "Add a way" : "Add your first way (e.g. Home, Work)"}</Text>
						</TouchableOpacity>
					</View>
				) : null}

				{show("news") && news.length ? (
					<View style={{ gap: 10 }}>
						<SectionLabel text="NEWS" />
						{news.map((item, i) => (
							<TouchableOpacity key={`news-${item.id}`} style={{ ...card, padding: 14 }} onPress={() => setOpenNews(openNews === i ? undefined : i)}>
								<Text style={{ color: theme.secondary, fontWeight: "800", fontSize: 14 }}>{item.title}</Text>
								<Text numberOfLines={openNews === i ? undefined : 2} style={{ color: theme.secondary, opacity: 0.7, fontWeight: "600", fontSize: 13, marginTop: 4, lineHeight: 18 }}>
									{item.description}
								</Text>
								{item.valid_from || item.valid_to ? (
									<Text style={{ color: theme.secondary, opacity: 0.5, fontWeight: "800", fontSize: 11, marginTop: 6 }}>
										{item.valid_from?.slice(0, 10)} – {item.valid_to?.slice(0, 10)}
									</Text>
								) : null}
							</TouchableOpacity>
						))}
					</View>
				) : null}
				{filter === "news" && !news.length ? <Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "700", textAlign: "center", marginTop: 20 }}>No announcements right now</Text> : null}

				{show("card") ? (
					<View style={{ gap: 10 }}>
						<SectionLabel text="CARD ACTIVITY" />
						<View style={card}>
							{first_card ? (
								<CardActivity alias={first_card} />
							) : (
								<Text style={{ color: theme.secondary, opacity: 0.6, fontWeight: "700", padding: 14 }}>Add a card in the Settings tab to see its activity</Text>
							)}
						</View>
					</View>
				) : null}

				{filter === "all" ? (
					<View style={{ gap: 10 }}>
						<SectionLabel text="TOOLS" />
						<View style={card}>
							<ToolRow icon="layers-triple" title="Group view" description="All buses on your favorite routes" onPress={() => router.navigate("/maps/Groupped")} />
							<ToolRow icon="map-marker-radius" title="R8R live map" description="Every bus in the city right now" onPress={() => router.navigate("/R8R")} />
							<ToolRow icon="crosshairs-gps" title="Snipe" description="Find and track a bus by its plate" onPress={() => router.navigate("/snipe")} last />
						</View>
					</View>
				) : null}
				{filter === "all" ? (
					<View>
						<SectionLabel text="ACCOUNT" />
						<CardJSONData
							favorite_data={{
								...profile?.data?.accountInfo,
								phone: `${profile?.data?.accountInfo?.phone?.slice(0, 3)}${"*".repeat((profile?.data?.accountInfo?.phone?.length || 10) - 3)}`,
							}}
							card={{ access_token: credentials.access_token?.slice(0, 10) + "...", refresh_token: credentials.refresh_token?.slice(0, 4) + "..." }}
						/>
					</View>
				) : null}
			</ScrollView>
			<Modal visible={pickerOpen} transparent={true} animationType="slide" onRequestClose={() => setPickerOpen(false)}>
				<Pressable onPress={() => setPickerOpen(false)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" }}>
					<Pressable style={{ backgroundColor: theme.dark, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingBottom: 28, gap: 10, maxHeight: "80%" }}>
						<View style={{ alignSelf: "center", width: 40, height: 5, borderRadius: 3, backgroundColor: "#c4c9d2", marginBottom: 4 }} />
						<Text style={{ color: theme.secondary, fontWeight: "800", fontSize: 17 }}>Card shown on Home</Text>
						<ScrollView contentContainerStyle={{ gap: 8 }}>
							{cards.map((card) => (
								<CardPickRow
									key={card.aliasNo}
									card={card}
									selected={card.aliasNo === first_card}
									onPick={() => pickCard(card.aliasNo)}
									onOpen={() => {
										setPickerOpen(false)
										router.navigate({ pathname: "/card_details/[alias]", params: { alias: card.aliasNo } })
									}}
								/>
							))}
						</ScrollView>
					</Pressable>
				</Pressable>
			</Modal>
		</KentKartAuthValidator>
	)
}
