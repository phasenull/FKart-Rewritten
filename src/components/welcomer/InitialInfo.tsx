import React, { useMemo, useState } from "react"
import { Text, View } from "react-native"
import { IIPage1 } from "./initial_info_pages/page_1_FKart"
import { IIPaginator } from "./InitialInfoPaginator"
import { IIPage2 } from "./initial_info_pages/page_2_CommunityMade"
import { IIPage3 } from "./initial_info_pages/page_3_OpenSource"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useGetAnnouncements } from "../../common/hooks/kentkart/info/useGetAnnouncements"
import { IIPageAnnouncement } from "./page_announcement"
import { dateFromMessedKentKartDateFormat } from "../../util"
const pages = [<IIPage1 />, <IIPage1 />, <IIPage1 />, <IIPage1 />, <IIPage1 />, <IIPage1 />, <IIPage1 />, <IIPage1 />]
export function InitialInfo(props: { navigation: NativeStackNavigationProp<any> }) {
	const { data: announcements } = useGetAnnouncements()
	const announcementObjects = useMemo(
		() => (
			<IIPageAnnouncement
				announcements={
					announcements?.data?.announceList?.map((data) => ({
						title: data.title,
						announcementType:"official",
						validFrom: dateFromMessedKentKartDateFormat(data.valid_from),
						validTo: dateFromMessedKentKartDateFormat(data.valid_to),
						extra: {},
						description: data.description,
						id: data.id,
						image: data.image,
					})) || []
				}
			/>
		),
		[announcements?.data]
	)
	return (
		// <View className="flex-col flex-1 items-center justify-center">
		<IIPaginator
			navigation={props.navigation}
			// onPageChange={(newIndex, prevIndex) => {
			// 	setPageIndex(newIndex)
			// }}
			children={[<IIPage1 key={"app-info"} />, <IIPage2 key={"community-made"} />, <IIPage3 key={"open-source"} />].concat(announcementObjects || [])}
		></IIPaginator>
		// </View>
	)
}
