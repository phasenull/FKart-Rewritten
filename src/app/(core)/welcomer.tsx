import React from "react"
import { IIPage1 } from "../../components/welcomer/initial_info_pages/page_1_FKart"
import { IIPage2 } from "../../components/welcomer/initial_info_pages/page_2_CommunityMade"
import { IIPage3 } from "../../components/welcomer/initial_info_pages/page_3_OpenSource"
import { IIPaginator } from "../../components/welcomer/InitialInfoPaginator"

import { useGetAnnouncements } from "common/hooks/kentkart/nonAuthHooks"
import CityValidator from "components/validators/CityValidator"
import { IIPageAnnouncement } from "components/welcomer/page_announcement"
import { Redirect } from "expo-router"
import SplashScreen from "../SplashScreen"
export default function InitialInfo(props: { last_check: number; }) {
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
		return <Redirect href={{ pathname: "/RootScreen" }} />
	}
	return (
			<IIPaginator
				// onPageChange={(newIndex, prevIndex) => {
				// 	setPageIndex(newIndex)
				// }}
			>
				{doesExist && <IIPage1 last_check={props.last_check} key={"app-info"} />}
				{doesExist && <IIPage3 key={"open-source"} />}
				{doesExist && <IIPage2 key={"community-made"} />}
				{doesExist && (
					<CityValidator redirect={true}>
						<IIPageAnnouncement key={"announcements"} />
					</CityValidator>
				)}
			</IIPaginator>
	)
}
