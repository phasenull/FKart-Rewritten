import { Image, Text, View } from "react-native"
import Application from "../../common/Application"
import Animated, { FadeIn } from "react-native-reanimated"
import * as Updates from "expo-updates"
import { Announcement } from "../../common/interfaces/app/Announcement"
export function IIPageAnnouncement(props: {
	announcements: Announcement[]
	}
) {
	return (
		<View className="justify-center flex-col flex-1 items-center px-4">
			<Animated.View entering={FadeIn.duration(300)} className="flex-col items-center justify-center">
				<Text className="text-3xl text-center" style={{ fontWeight: "800", color: Application.styles.secondary }}>
					{/* {props.title} */}
				</Text>
			</Animated.View>
			<View
				className="px-2 h-6"
				h-6
				style={{
					backgroundColor: "#000",
					borderRadius: 6,
					marginTop: 4 * 4,
				}}
			>
				<Text
					className="text-center my-auto"
					style={{
						fontWeight: "900",
						color: "#fff",
					}}
				>
					{/* {props.announcementType + " announcement"} */}
				</Text>
			</View>
			<Image
				style={{
					marginTop: 16,
					width: 48 * 4,
					height: 48 * 4,
					opacity: 0.2,
					objectFit: "scale-down",
				}}
				// source={{ uri: props.image || "https://icons.veryicon.com/png/o/miscellaneous/standard/announcement-12.png" }}
			/>

			<Text
				style={{
					color: Application.styles.secondary,
					fontWeight: "600",
					fontSize: 16,
					textAlign: "left",
				}}
			>
				{/* {props.description} */}
			</Text>
			<View>
				<Text>
					{/* Valid through {props.extra?.validTo.toLocaleString() || "?"} */}
					{" -> "}
					{/* {props.extra?.validTo.toLocaleString() || "?"} */}
				</Text>
			</View>
		</View>
	)
}
