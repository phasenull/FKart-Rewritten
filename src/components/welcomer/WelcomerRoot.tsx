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

	return (
		// <View className="flex-col flex-1 items-center justify-center">
		<IIPaginator
			navigation={props.navigation}
			// onPageChange={(newIndex, prevIndex) => {
			// 	setPageIndex(newIndex)
			// }}
		>
			<IIPage1 key={"app-info"} />
			<IIPage2 key={"community-made"} />
			<IIPage3 key={"open-source"} />
			<IIPageAnnouncement
				key={"announcements"}
				announcements={
					announcements?.data?.announceList?.map((data) => ({
						title: data.title,
						announcementType: "official",
						extra: {
							validFrom: dateFromMessedKentKartDateFormat(data.valid_from),
							validTo: dateFromMessedKentKartDateFormat(data.valid_to),
							targetRoutes:["633"]
						},
						description: data.description,
						id: data.id,
						image: data.image,
					})) || []
				}
			/>
		</IIPaginator>
		// </View>
	)
}
