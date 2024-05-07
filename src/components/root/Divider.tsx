import { DimensionValue, StyleProp, View, ViewStyle } from "react-native"
import Application from "../../common/Application"

export default function Divider(props: {
	style?: StyleProp<ViewStyle>
	className?: string
	height?: DimensionValue
}) {
	const styles = Application.styles
	const { className } = props
	return (
		<View
			key={`separator`}
			className={"opacity-10 w-0.5 " + className}
			style={{ backgroundColor: Application.styles.secondary, height: props.height || "100%" }}
		/>
	)
}
