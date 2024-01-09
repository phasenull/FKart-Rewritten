import { ActivityIndicator } from "react-native";
import Application from "../common/Application";

export default function CustomLoadingIndicator() {
	return <ActivityIndicator
		className="mx-auto my-auto scale-150"
		size="large"
		color={Application.styles.primary}
	/>
}
