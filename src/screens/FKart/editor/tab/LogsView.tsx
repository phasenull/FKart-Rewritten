import { getLogsAsync } from "common/hooks/fkart/auth/getLogs"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import { useContext } from "react"
import { RefreshControl, Text, View, ViewProps } from "react-native"
import { useInfiniteQuery, useQuery } from "react-query"
import LogTouchable from "./LogTouchable"
import { ThemeContext } from "common/contexts/ThemeContext"
import SecondaryText from "components/reusables/SecondaryText"
import SimplyButton from "components/ui/SimplyButton"
import Logger from "common/Logger"
import { useFKartAuthStore } from "common/stores/FKartAuthStore"
import { ScrollView } from "react-native-gesture-handler"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { TouchableOpacity } from "@gorhom/bottom-sheet"

export default function LogsView(props: ViewProps) {
	// Only use in components that are child of a FKartValidator
	const { theme } = useContext(ThemeContext)
	const credentials = useFKartAuthStore((state) => state.credentials)
	const { isFetching, refetch, data, isRefetching, isError, error, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery(["getLogs",credentials.access_token], {
		retry: false,
		// staleTime:5*1000,
		getNextPageParam: (lastpage, allpages) => {
			return (lastpage as any)?.data?.next_cursor
		},
		queryFn: ({ pageParam }) => {
			Logger.info("getLogsAsync", `hook ${pageParam} ${typeof pageParam}`)
			if (pageParam === "") return
			return getLogsAsync(credentials.access_token, pageParam)
		},
	})
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
					borderRadius: 16,
					paddingHorizontal: 2 * 4,
					// paddingVertical: 2 * 4,
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
			<View className="flex-row self-center items-center justify-between w-full mb-2">
				<SecondaryText>logs ({data?.pages.length})</SecondaryText>
				<TouchableOpacity onPress={()=>refetch()} style={{ borderRadius: 1000, aspectRatio: 1 }}>
					<MaterialCommunityIcons color={theme.secondary} size={6*4} name="refresh" />
				</TouchableOpacity>
			</View>
			<ScrollView className="max-h-64">{data?.pages.map((page) => (page as any)?.data?.logs?.map((logObject: any) => <LogTouchable key={logObject.id} log={logObject} />))}</ScrollView>
			<SimplyButton
				style={{ width: 32 * 4, alignSelf: "center", marginTop: 1 * 4 }}
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
