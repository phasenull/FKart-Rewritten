import {
	TextInput,
	TouchableOpacity,
	View,
} from "react-native"
import Application from "../../../common/Application"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useContext, useEffect, useState } from "react"
import FilterByRouteTypeModal from "./FilterByRouteTypeModal"
import { ThemeContext } from "../../../common/contexts/ThemeContext"

export default function RouteSearchBar(props: {
	onChangeText: (e: string) => void
	filterByRouteType: {
		key: string
		label?: string | undefined
		value?: any
		onPress?: any
	}
	setFilterByRouteType: (e: {
		key: string
		label?: string | undefined
		value?: any
		onPress?: any
	}) => void
}) {
	const {theme} = useContext(ThemeContext)
	const {
		onChangeText,
		filterByRouteType,
		setFilterByRouteType,
	} = props
	const [searchText, setSearchText] = useState("")
	useEffect(() => {
		onChangeText(searchText)
	}, [searchText])
	const [showFilter, setShowFilter] = useState(false)
	return (
		<View className="flex-col">
			<FilterByRouteTypeModal
				filterByRouteType={filterByRouteType}
				setFilterByRouteType={setFilterByRouteType}
				visible={showFilter}
				setVisible={setShowFilter}
			/>
			<View className="w-full mt-3 px-4 items-center justify-center self-center flex-row">
				<View
					className="flex-1 w-80 px-4 rounded-full items-center justify-center flex-row"
					style={{
						backgroundColor: theme.white,
						elevation: 10,
						shadowOffset: { height: 4, width: 4 },
					}}
				>
					{searchText === "" ? null : (
						// nobodys gonna know 🤫
						<TouchableOpacity
							className="py-2 pr-2 opacity-50"
							onPress={() => setSearchText("")}
						>
							<MaterialCommunityIcons
								color={theme.secondary}
								size={24}
								name="close-circle-outline"
							/>
						</TouchableOpacity>
					)}
					<TextInput
						className="mx-1 h-14 bg-transparent flex-1"
						onChangeText={(text) => setSearchText(text)}
						placeholder="Search Routes"
						style={{
							color: theme.secondaryDark,
							fontSize: 16,
							fontWeight: "600",
						}}
						value={searchText}
					/>
					<MaterialCommunityIcons
						color={theme.secondary}
						size={28}
						name="magnify"
					/>
				</View>
				<TouchableOpacity
					onPress={() => {
						setShowFilter(!showFilter)
					}}
					className="ml-1.5 h-14 w-12 rounded-full items-center justify-center"
					style={{
						backgroundColor: theme.white,
						elevation: 10,
						shadowOffset: { height: 4, width: 4 },
					}}
				>
					<MaterialCommunityIcons name="filter-outline" size={28} />
				</TouchableOpacity>
			</View>
		</View>
	)
}
