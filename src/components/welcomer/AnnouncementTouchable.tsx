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
			className="items-center flex-row gap-x-2 justify-start"
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
			<View className="flex-col">
				<View className="flex-col">
					{/* {announcement.extra?.targetRoutes?.map((route: string) => (
						<View
							key={route}
							className="w-12 h-6"
							style={{
								backgroundColor: Application.styles.primary,
								borderRadius: 6,
							}}
						>
							<Text
								className="text-center my-auto"
								style={{
									fontWeight: "900",
									fontSize: 12,
									color: Application.styles.white,
									borderRadius: 6,
								}}
							>
								{route}
							</Text>
						</View>
					))} */}
				</View>
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
			</View>
		</TouchableOpacity>
	)
}
