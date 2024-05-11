import { DimensionValue, StyleProp, View, ViewStyle } from "react-native"
import Application from "common/Application"
import { useContext } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"

export default function Divider(props: { style?: StyleProp<ViewStyle>; className?: string; height?: DimensionValue }) {
	
	const { theme } = useContext(ThemeContext)
	const { className } = props
	return <View key={`separator`} className={"opacity-10 w-0.5 " + className} style={{ backgroundColor: theme.secondary, height: props.height || "100%" }} />
}
