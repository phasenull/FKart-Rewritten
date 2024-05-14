import { FKartContext } from "common/contexts/FKartContext"
import { getLogsAsync } from "common/hooks/fkart/auth/getLogs"
import ICredentials from "common/interfaces/app/Credentials"
import CustomLoadingIndicator from "components/root/CustomLoadingIndicator"
import { useContext } from "react"
import { Text, View } from "react-native"
import { useQuery } from "react-query"
import LogTouchable from "./LogTouchable"
import { ThemeContext } from "common/contexts/ThemeContext"
import SecondaryText from "components/root/SecondaryText"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function LogsView() {
	// Only use in components that are child of a FKartValidator
	const { userManager } = useContext(FKartContext)
	const { theme } = useContext(ThemeContext)
	const { isFetching, data, isRefetching, isError, error } = useQuery(["getLogs"], () => getLogsAsync(userManager.accessToken), { refetchInterval: 60 * 1000, staleTime: 5 * 1000 })
	if (isFetching &&!isRefetching) {
		return <CustomLoadingIndicator size={12 * 4} />
	}
	if (isError) {
		return (
			<View style={{ backgroundColor: theme.white, elevation: 10, borderRadius: 16, paddingHorizontal: 4 * 4, paddingVertical: 2 * 4, width: "80%", maxWidth: 80 * 4, minWidth: 40 * 4 }}>
				<SecondaryText style={{ color: theme.error }}>{(error as any)?.response?.data?.result?.error || "unknown error"}</SecondaryText>
			</View>
		)
	}
	return (
		<View style={{ backgroundColor: theme.white, elevation: 10, borderRadius: 16, paddingHorizontal: 4 * 4, paddingVertical: 2 * 4, width: "80%", maxWidth: 80 * 4, minWidth: 40 * 4 }}>
			{isRefetching ? (
				<View className="absolute self-center flex-1 top-10" >
					<CustomLoadingIndicator size={4*4} />
				</View>
			) : null}
			<SecondaryText className="self-center mb-2">Logs</SecondaryText>
			{data?.data.logs.map((logObject) => (
				<LogTouchable key={logObject.id} log={logObject} />
			))}
		</View>
	)
}
