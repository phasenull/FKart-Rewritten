import { TouchableOpacity } from "react-native-gesture-handler"
import SecondaryText from "./SecondaryText"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Application from "../../common/Application"
import { Clipboard, ToastAndroid, Vibration } from "react-native"
import { useEffect, useMemo, useRef, useState } from "react"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

export default function LogPop(props: { title: string; description: string; destroyLogPop: () => void; at: number }) {
	const linear = useSharedValue(100)
	const animatedChanged = useAnimatedStyle(() => {
		return {
			width: `${linear.value}%`,
		}
	})
	return useMemo(() => {
		const duration = 5_000
		setTimeout(props.destroyLogPop, duration)
		linear.value = 100
		linear.value = withTiming(0, { duration: duration, easing: Easing.linear })
		return (
			<TouchableOpacity
				onLongPress={() => {
					Clipboard.setString(`~Error:\n${props.title}\n~Description:\n${props.description}`)
					Vibration.vibrate(100)
					ToastAndroid.show("Copied LogPop to clipboard!", 1000)
				}}
				style={{
					backgroundColor: Application.styles.warning,
					marginTop: 4 * 4,
					paddingLeft: 4 * 4,
					borderRadius: 4,
					flexDirection: "row",
				}}
			>
				<SecondaryText style={{ marginRight: 4 * 4 }}>{props.title}</SecondaryText>
				<TouchableOpacity onPress={props.destroyLogPop}>
					<MaterialCommunityIcons name="close" size={24} color={Application.styles.white} />
				</TouchableOpacity>
				<Animated.View style={[animatedChanged, { backgroundColor: Application.styles.white, height: 1 * 4, position: "absolute", bottom: 0 }]} />
			</TouchableOpacity>
		)
	}, [])
}
