import { FlatList, Image, Text, View } from "react-native"
import Application from "../../common/Application"
import Animated, { FadeIn } from "react-native-reanimated"
import * as Updates from "expo-updates"
import { Announcement } from "../../common/interfaces/app/Announcement"
import  AnnouncementTouchable  from "./AnnouncementTouchable"
import { useMemo } from "react"
export function IIPageAnnouncement(props: { announcements: Announcement[] }) {
	const { announcements } = props

	return (
		<View className="justify-center flex-col flex-1 items-center px-4">
			<Text
				style={{
					color: Application.styles.secondary,
					fontWeight: "800",
					fontSize: 24,
				}}
			>
				Hi {Application.logged_user?.name}, {"\n"}You have {announcements.length} unread announcements since you were gone
			</Text>
				
			<FlatList
				className="mt-12 w-80 -mb-12"
				style={{
					backgroundColor: Application.styles.white,
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
