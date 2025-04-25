import ErrorPage from "app/ErrorPage";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function Snipe() {
	// hooks
	const {key,vehicle_id} = useLocalSearchParams()
	if (!(key&&vehicle_id)) return <Redirect href={{pathname:"/snipe/picker"}}/>
}