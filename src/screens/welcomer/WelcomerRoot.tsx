import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React from "react"
import { IIPage1 } from "./initial_info_pages/page_1_FKart"
import { IIPage2 } from "./initial_info_pages/page_2_CommunityMade"
import { IIPage3 } from "./initial_info_pages/page_3_OpenSource"
import { IIPaginator } from "./InitialInfoPaginator"

import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { IIPageAnnouncement } from "./page_announcement"
import CityValidator from "components/validators/CityValidator"
import CitySelector from "screens/city_selector/CitySelector"
import { useGetAnnouncements } from "common/hooks/kentkart/nonAuthHooks"
export function InitialInfo(props: { last_check: number; navigation: NativeStackNavigationProp<any> }) {
	const { data } = useGetAnnouncements()
	if (data && data.data && data.data.announceList && data.data.announceList.length === 0) {
		props.navigation.replace("home")
		return
	}
	return (
		// <View className="flex-col flex-1 items-center justify-center">
		<IIPaginator
			navigation={props.navigation}
			// onPageChange={(newIndex, prevIndex) => {
			// 	setPageIndex(newIndex)
			// }}
		>
			<IIPage1 last_check={props.last_check} key={"app-info"} />
			<IIPage2 key={"community-made"} />
			<IIPage3 key={"open-source"} />
			{(data?.data?.announceList?.length || 0) > 0 ? (
				<CityValidator navigation={props.navigation} redirect={true}>
					<IIPageAnnouncement key={"announcements"} />
				</CityValidator>
			) : undefined}
		</IIPaginator>
		// </View>
	)
}
