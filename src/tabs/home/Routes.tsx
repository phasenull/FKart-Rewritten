import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import useGetRouteList from "../../common/hooks/useGetRouteList"
import Application from "../../common/Application"
import {
	ActivityIndicator,
	FlatList,
	Keyboard,
	Modal,
	RefreshControl,
	Text,
	TextInput,
	TouchableHighlight,
	TouchableOpacity,
	TouchableWithoutFeedback,
	TouchableWithoutFeedbackComponent,
	View,
} from "react-native"
import BasicRouteInformation from "../../common/interfaces/BasicRouteInformation"
import React, { useMemo, useState } from "react"
import RouteTouchableContainer from "../../components/containers/RouteTouchableContainer"
import CustomLoadingIndicator from "../../components/CustomLoadingIndicator"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import RouteList from "../../components/containers/RouteList"
import SegmentedButtons from "../../components/SegmentedButtons"
export default function Routes(props: {
	route: any
	navigation: NativeStackNavigationProp<any>
}) {
	const {
		data,
		isLoading,
		isError,
		error,
		refetch,
		isRefetching,
	} = useGetRouteList({ region: Application.region })
	const { navigation, route } = props
	const [searchText, setSearchText] = useState("")
	function refreshData() {
		console.log("refreshing data")
		refetch()
	}
	const [showFilter, setShowFilter] = useState(false)
	const [filterByRouteType, setFilterByRouteType] = useState<{
		key: string
		label?: string
		value?: any
		onPress?: any
	}>({ key: "all" })
	if (isLoading || isRefetching) {
		return <CustomLoadingIndicator />
	}
	if (isError) {
		return (
			<View>
				<RefreshControl
					refreshing={isLoading}
					onRefresh={refreshData}
				/>
				<Text>
					Unexpected Error: {JSON.stringify(error) || "unknown error"}
				</Text>
			</View>
		)
	}
	if (!data) {
		return (
			<View>
				<Text>No data found</Text>
			</View>
		)
	}
	if (!data.routeList) {
		refetch()
	}
	return (
		<React.Fragment>
			<View className="absolute w-full mt-2 px-4 items-center justify-center self-center flex-row">
				<View
					className="flex-1 w-80 px-4 rounded-full items-center justify-center flex-row"
					style={{
						backgroundColor: Application.styles.white,
						elevation: 10,
						shadowOffset: { height: 4, width: 4 },
						zIndex: 100,
					}}
				>
					{searchText === "" ? null : (
						// nobodys gonna know 🤫
						<TouchableOpacity
							className="py-2 pr-2 opacity-50"
							onPress={() => setSearchText("")}
						>
							<MaterialCommunityIcons
								color={Application.styles.secondary}
								size={24}
								name="close-circle-outline"
							/>
						</TouchableOpacity>
					)}
					<TextInput
						className="mx-1 h-16 bg-transparent flex-1"
						onChangeText={(text) => setSearchText(text)}
						placeholder="Search Routes"
						style={{
							color: Application.styles.secondaryDark,
							fontSize: 16,
							fontWeight: "600",
						}}
						value={searchText}
					/>
					<MaterialCommunityIcons
						color={Application.styles.secondary}
						size={28}
						name="magnify"
					/>
				</View>
				<TouchableOpacity
					onPress={() => {
						setShowFilter(true)
					}}
					className="ml-1.5 h-16 w-12 rounded-full items-center justify-center"
					style={{
						backgroundColor: Application.styles.white,
						elevation: 10,
						shadowOffset: { height: 4, width: 4 },
						zIndex: 100,
					}}
				>
					<MaterialCommunityIcons name="filter" size={28} />
				</TouchableOpacity>
			</View>
			<Modal
				transparent={true}
				visible={showFilter}
				onDismiss={() => {
					setShowFilter(false)
				}}
			>
				{/* semi transparent shadow */}
				{/* note: for some reason Feedbackless component throws an error and
				i have no idea why, so instead i fould a *real* solution like a pro programmer 😎 */}
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						setShowFilter(false)
					}}
					className="h-full w-full absolute"
					style={{ backgroundColor: "black", opacity: 0.5 }}
				/>
				<View
					className="w-80 px-4 rounded-[16px] py-5 my-auto items-center justify-center self-center"
					style={{
						backgroundColor: Application.styles.white,
						elevation: 10,
						shadowOffset: { height: 4, width: 4 },
						zIndex: 100,
					}}
				>
					<Text className="font-bold text-xl mb-5">
						Filter by Route Type
					</Text>
					<SegmentedButtons
						onSelect={(item) => {
							setShowFilter(false)
							setFilterByRouteType(item)
						}}
						defaultKey={filterByRouteType.key}
						values={[
							{
								label: "All",
								key: "all",
								value: undefined,
							},
							{
								label: "Bus",
								key: "bus",
								value: "3",
							},
							{
								label: "Tram",
								key: "tram",
								value: "0",
							},
							{
								label: "Ferry",
								key: "ferry",
								value: "4",
							},
						]}
					/>
				</View>
			</Modal>
			<RouteList
				data={data}
				navigation={navigation}
				onRefresh={refreshData}
				refreshing={isRefetching}
				searchText={searchText}
				route={route}
				routeType={filterByRouteType.value}
			/>
		</React.Fragment>
	)
}
