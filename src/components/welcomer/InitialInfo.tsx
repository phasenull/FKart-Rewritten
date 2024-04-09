import { useState } from "react"
import { Text, View } from "react-native"
import { IIPage1 } from "./initial_info_pages/page_1_FKart"
import { IIPaginator } from "./InitialInfoPaginator"
import { IIPage2 } from "./initial_info_pages/page_2_CommunityMade"
import { IIPage3 } from "./initial_info_pages/page_3_OpenSource"
const pages = [<IIPage1 />, <IIPage1 />, <IIPage1 />, <IIPage1 />, <IIPage1 />, <IIPage1 />, <IIPage1 />, <IIPage1 />]
export function InitialInfo() {
	const [pageIndex, setPageIndex] = useState(0)
	return (
		// <View className="flex-col flex-1 items-center justify-center">
		<IIPaginator
			// onPageChange={(newIndex, prevIndex) => {
			// 	setPageIndex(newIndex)
			// }}
		>
			<IIPage1 key={"app-info"} />
			<IIPage2 key={"community-made"} />
			<IIPage3 key={"open-source"} />
		</IIPaginator>
		// </View>
	)
}
