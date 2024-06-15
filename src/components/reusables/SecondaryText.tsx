import { Text, TextProps } from "react-native"
import ApplicationConfig from "common/ApplicationConfig"
import { useContext } from "react"
import { ThemeContext } from "common/contexts/ThemeContext"

export default function SecondaryText(props: TextProps) {
	const { theme } = useContext(ThemeContext)

	return (
		<Text
			style={[
				{
					fontWeight: "800",
					color: theme.secondary,
					fontSize: 18,
				},
				props.style,
			]}
		>
			{props.children}
		</Text>
	)
}
