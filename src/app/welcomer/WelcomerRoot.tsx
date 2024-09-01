import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useState } from "react"
import { IIPage1 } from "./initial_info_pages/page_1_FKart"
import { IIPage2 } from "./initial_info_pages/page_2_CommunityMade"
import { IIPage3 } from "./initial_info_pages/page_3_OpenSource"
import { IIPaginator } from "./InitialInfoPaginator"

import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { IIPageAnnouncement } from "./page_announcement"
import CityValidator from "components/validators/CityValidator"
import CitySelector from "../(core)/city_selector"
import { useGetAnnouncements } from "common/hooks/kentkart/nonAuthHooks"
import RootScreen from "../RootScreen"
import SplashScreen from "../SplashScreen"
export function InitialInfo(props: { last_check: number; navigation: NativeStackNavigationProp<any> }) {
	const { data, isLoading } = useGetAnnouncements()
	const doesExist = data?.data?.announceList?.length
	const isLoaded = !!data
	const logs: string[] = []
	if (!isLoaded || isLoading) logs.push("fetching announcements")
	if (isLoaded) logs.push("announcements fetched")
	if (!isLoaded) {
		return <SplashScreen logs={logs} />
	}
	if (isLoaded && !doesExist) {
		return <RootScreen navigation={props.navigation} />
	}
	return (
		// <View className="flex-col flex-1 items-center justify-center">
		<IIPaginator
			navigation={props.navigation}
			// onPageChange={(newIndex, prevIndex) => {
			// 	setPageIndex(newIndex)
			// }}
		>
			{doesExist && <IIPage1 last_check={props.last_check} key={"app-info"} />}
			{doesExist && <IIPage3 key={"open-source"} />}
			{doesExist && <IIPage2 key={"community-made"} />}
			{doesExist && (
				<CityValidator navigation={props.navigation} redirect={true}>
					<IIPageAnnouncement key={"announcements"} />
				</CityValidator>
			)}
		</IIPaginator>
		// </View>
	)
}
