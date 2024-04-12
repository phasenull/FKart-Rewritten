import { TouchableOpacity } from "react-native-gesture-handler";
import { Announcement } from "../../../common/interfaces/app/Announcement";

export function AnnouncementTouchable(props:{announcement:Announcement}) {
	const {announcement} = props
	if (!announcement) {}

	return <TouchableOpacity>
		
	</TouchableOpacity>
}