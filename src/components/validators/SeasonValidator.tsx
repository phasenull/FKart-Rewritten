import { MaterialCommunityIcons } from "@expo/vector-icons"
import { AxiosResponse } from "axios"
import { ThemeContext } from "common/contexts/ThemeContext"
import getSeasonAsync from "common/hooks/fkart/api/getSeasonAsync"
import BaseFKartResponse from "common/interfaces/FKart/BaseFKartResponse"
import CustomLoadingIndicator from "components/root/CustomLoadingIndicator"
import SecondaryText from "components/root/SecondaryText"
import { useContext } from "react"
import { View } from "react-native"
import { processColorsInProps } from "react-native-reanimated/lib/typescript/reanimated2/Colors"
import { UseQueryResult, useQuery } from "react-query"

export default function SeasonValidator(props:{children:any}) {
	const { data, error, isError, isFetching, isRefetching } = useQuery(["getSeason"], getSeasonAsync) as UseQueryResult<
		AxiosResponse<
			BaseFKartResponse & {
				season: "summer" | "winter"
			}
		>
	>
	const { theme } = useContext(ThemeContext)
	if (isRefetching || isFetching) {
		return (
			<View className="flex-1 items-center justify-center">
				<CustomLoadingIndicator />
				<SecondaryText>Checking Season...</SecondaryText>
			</View>
		)
	}
	if (!data?.data || isError || error) {
		return (
			<View className="flex-1 items-center justify-center">
				<SecondaryText style={{ color: theme.error }}>Season service is not available, cant proceed</SecondaryText>
			</View>
		)
	}
	const season = data?.data.season
	if (season === "winter") {
		return <View className="flex-1 items-center justify-center">
			<MaterialCommunityIcons size={24*4} />
			<SecondaryText style={{fontSize:36}}>
				Winter is here!
			</SecondaryText>
			<SecondaryText>
				This service is not available in winter.
			</SecondaryText>
		</View>
	}
	return props.children
}
