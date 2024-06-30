import { getLogsAsync } from "common/hooks/fkart/auth/getLogs"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import { useContext } from "react"
import { Text, View, ViewProps } from "react-native"
import { useInfiniteQuery, useQuery } from "react-query"
import LogTouchable from "./LogTouchable"
import { ThemeContext } from "common/contexts/ThemeContext"
import SecondaryText from "components/reusables/SecondaryText"
import SimplyButton from "components/ui/SimplyButton"
import Logger from "common/Logger"

export default function LogsView(props: ViewProps) {
	// Only use in components that are child of a FKartValidator
	return
	const { theme } = useContext(ThemeContext)
	const { isFetching, data, isRefetching, isError, error, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery(
		["getLogs"],
		({ pageParam = 0 }) => {
			Logger.info("getLogsAsync",`hook ${pageParam || "undefined"}`)
			return
		},
		{
			refetchInterval: 5 * 1000,
			retry: false,
			getNextPageParam: (lastpage, allpages) => {
				return lastpage.data.next_cursor
			},
		}
	)
	if (isFetching && !isRefetching) {
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
		<View
			style={[
				{
					backgroundColor: theme.white,
					elevation: 10,
					borderRadius: 16,
					paddingHorizontal: 4 * 4,
					paddingVertical: 2 * 4,
					width: "80%",
					maxWidth: 80 * 4,
					minWidth: 40 * 4,
				},
				props.style,
			]}
		>
			{isRefetching ? (
				<View className="absolute self-center flex-1 top-10">
					<CustomLoadingIndicator size={4 * 4} />
				</View>
			) : null}
			<SecondaryText className="self-center mb-2">Logs ({data?.pages.length})</SecondaryText>
			{data?.pages.map((page) => page.data.logs.map((logObject) => <LogTouchable key={logObject.id} log={logObject} />))}
			<SimplyButton
				style={{ width: 32 * 4, alignSelf: "center", marginTop: 4 * 4 }}
				processingText="loading..."
				processing={isFetchingNextPage}
				size="medium"
				text={hasNextPage ? `Load More` : "end of list"}
				disabled={!hasNextPage}
				onPress={() => fetchNextPage()}
			/>
		</View>
	)
}
