import { TouchableOpacity } from "react-native-gesture-handler"
import { Announcement } from "../../common/interfaces/app/Announcement"
import { Text, View } from "react-native"
import Application from "../../common/Application"
import Divider from "../Divider"

export default function AnnouncementTouchable(props: { index: number; item: Announcement }) {
	const { index, item: announcement } = props

	return (
		<TouchableOpacity
			onPress={() => {
				alert(announcement.description)
			}}
			key={announcement.id.toString() + announcement.title}
			className="items-center flex-row my-0.5 gap-x-2 justify-start"
		>
			{/* MARK: announcement type */}
			<View
				className="px-2 h-6"
				style={{
					backgroundColor: "#000",
					borderRadius: 6,
				}}
			>
				<Text
					className="text-center my-auto"
					style={{
						fontWeight: "900",
						color: "#fff",
					}}
				>
					{announcement.announcementType}
				</Text>
			</View>
			{/* <Divider /> */}
			<View className="flex-row mr-2 flex-1">

				<Text
					style={{
						color: Application.styles.secondary,
						fontSize: 16,
						fontWeight: "800",
						textAlignVertical: "center",
					}}
				>
					{announcement.title}
				</Text>
				<Text style={{
						color: Application.styles.secondary,
						opacity:0.6,
						fontSize: 12,
						marginLeft:2*4,
						fontWeight: "800",
						textAlignVertical: "center",
						overflow:"hidden",
						flex:1
					}}
					numberOfLines={1}
					>
						{announcement.description}
				</Text>
			</View>
		</TouchableOpacity>
	)
}
