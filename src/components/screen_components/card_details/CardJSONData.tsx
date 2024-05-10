import { useContext, useMemo } from "react"
import { Text } from "react-native"
import Application from "../../../common/Application";
import { ThemeContext } from "../../../common/contexts/ThemeContext";

export default function CardJSONData(props: { card: any; favorite_data: any }) {
	const { card, favorite_data } = props
	const {theme} = useContext(ThemeContext)

	return (
		<Text
			className="p-4 my-10 w-80"
			style={{
				backgroundColor: theme.dark,
				borderRadius: 16,
				elevation: 10,
				color: theme.secondaryDark,
			}}
		>
			Data: {JSON.stringify({ ...favorite_data, ...card }, null, 4)}
			{/* Loads in line: {JSON.stringify(card.loads_in_line, null, 4)} */}
		</Text>
	)
}
