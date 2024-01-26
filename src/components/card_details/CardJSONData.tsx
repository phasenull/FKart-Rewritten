import { useMemo } from "react";
import { Text } from "react-native";
import Application from "../../common/Application";

export default function CardJSONData(props: { card: any; favorite_data: any}) {
	const { card, favorite_data } = props
	const styles = Application.styles
	return useMemo(()=>{return (
		
		<Text
		className="p-4 my-10 w-80"
		style={{
			backgroundColor: styles.dark,
			borderRadius: 16,
			elevation: 10,
			color: styles.secondaryDark,
		}}
	>
		Card Data: {JSON.stringify({ ...favorite_data, ...card }, null, 4)}
		{/* Loads in line: {JSON.stringify(card.loads_in_line, null, 4)} */}
	</Text>
	)},[])
}