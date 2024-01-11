import { TextInput, TouchableOpacity, View } from "react-native";
import Application from "../../common/Application";
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useEffect, useState } from "react";

export default function RouteSearchBar(props: {onChangeText:(e:string)=>void, setShowFilter:(e:boolean)=>void})
{
	const {onChangeText, setShowFilter} = props
	const [searchText, setSearchText] = useState("")
	useEffect(()=>{
		onChangeText(searchText)
	}, [searchText])
	return (<View className="absolute w-full mt-2 px-4 items-center justify-center self-center flex-row">
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
		<MaterialCommunityIcons name="filter-outline" size={28} />
	</TouchableOpacity>
</View>)
}