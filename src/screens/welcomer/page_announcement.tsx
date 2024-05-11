import { FlatList, Image, Text, View } from "react-native"
import Application from "common/Application"
import Animated, { FadeIn } from "react-native-reanimated"
import * as Updates from "expo-updates"
import { Announcement } from "common/interfaces/app/Announcement"
import  AnnouncementTouchable  from "./AnnouncementTouchable"
import { useContext, useMemo } from "react"
import { TranslationsContext } from "common/contexts/TranslationsContext" 
import { UserContext } from "common/contexts/UserContext"
import { ThemeContext } from "common/contexts/ThemeContext"
export function IIPageAnnouncement(props: { announcements: Announcement[] }) {
	const {theme} = useContext(ThemeContext)
	const { announcements } = props
	const {translations} = useContext(TranslationsContext)
	const {loggedUser} = useContext(UserContext)
	return (
		<View className="justify-center flex-col flex-1 items-center px-4">
			<Text
				style={{
					color: theme.secondary,
					fontWeight: "800",
					fontSize: 24,
				}}
			>
				{translations.screens.welcomer.unread_announcements({announcement_count:announcements.length,user_name:loggedUser?.name})}
			</Text>
			<FlatList
				className="mt-12 w-80 -mb-12"
				style={{
					backgroundColor: theme.white,
					maxHeight: 80 * 4,
					borderRadius: 16,
					elevation: 4,
					marginHorizontal: 2 * 4,
				}}
				contentContainerStyle={{
					borderRadius: 16,
				}}
				renderItem={(e)=>{return <AnnouncementTouchable index={e.index} item={e.item} />}}
				data={announcements}
			/>
		</View>
	)
}
