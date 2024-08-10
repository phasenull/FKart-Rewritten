import { FlatList, Image, Text, View } from "react-native"
import ApplicationConfig from "common/ApplicationConfig"
import Animated, { FadeIn } from "react-native-reanimated"
import * as Updates from "expo-updates"
import { Announcement } from "common/interfaces/app/Announcement"
import  AnnouncementTouchable  from "./AnnouncementTouchable"
import { useContext, useEffect, useMemo, useState } from "react"
import { TranslationsContext } from "common/contexts/TranslationsContext" 
import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetAnnouncements } from "common/hooks/kentkart/nonAuthHooks"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { IKentKartUser } from "common/interfaces/KentKart/KentKartUser"
export function IIPageAnnouncement() {
	const {theme} = useContext(ThemeContext)
	const {translations} = useContext(TranslationsContext)
	const {user} = useKentKartAuthStore((state)=>state)
	const { data } = useGetAnnouncements()
	const [announcements,setAnnouncements] = useState<[]|Announcement[]>([])
	useEffect(()=>{
		setAnnouncements(data?.data?.announceList?.map((data) => ({
			title: data.title,
			announcementType: "official",
			extra: {
				validFrom: new Date(data.valid_from),
				validTo: new Date(data.valid_to),
				targetRoutes:["633"]
			},
			description: data.description,
			id: data.id,
			image: data.image,
		})) || [])
	},[data?.data])
	return (
		<View className="justify-center flex-col flex-1 items-center px-4">
			<Text
				style={{
					color: theme.secondary,
					fontWeight: "800",
					fontSize: 24,
				}}
			>
				{translations.screens.welcomer.unread_announcements({announcement_count:announcements.length,user_name:user?.name})}
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
