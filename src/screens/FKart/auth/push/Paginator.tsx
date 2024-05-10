import React, { useContext, useEffect, useMemo, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Application from "../../../../common/Application";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TranslationsContext } from "../../../../common/contexts/TranslationsContext";
import SelectLangModal from "../../../../components/root/SelectLangModal";
import { Langs } from "../../../../common/enums/Langs";
export function Paginator(props: {navigation:NativeStackNavigationProp<any>, initialIndex?: number; onPageChange?: (newIndex: number, previousIndex?: number) => void; children: any }) {
	// console.log("IIPaginator Update",props?.children?.length)
	const [page, setPage] = useState(props.initialIndex || 0)
	function movePage(dir: -1 | 1) {
		const result = Math.max(0, Math.min(page + dir, props.children.length - 1))
		setPage(result)
	}
	const {translations,setLang} = useContext(TranslationsContext)
	const [showTranslationSelector,setShowTranslationSelector] = useState(false)
	return (
		<View className="flex-1 justify-between items-center">
			<SelectLangModal defaultValue={Langs.tr} onDismiss={()=>setShowTranslationSelector(false)} visible={showTranslationSelector} onSelect={setLang} />
			<TouchableOpacity style={{backgroundColor:Application.styles.white,borderRadius:16}} className="p-4 absolute self-center mt-4" onPress={()=>setShowTranslationSelector(true)}>
				<MaterialCommunityIcons name="translate" color={Application.styles.secondary} size={48}/>
			</TouchableOpacity>
			<View className="flex-1">
				{props.children[page] || (
					<View className={"items-center"}>
						<Text>error at index {page}</Text>
					</View>
				)}
			</View>
			<View className="flex-row w-80 mt-4 justify-center mb-4 gap-x-2">
				{page == 0 ? null : <TouchableOpacity
					style={{
						borderRadius: 16,
						paddingHorizontal: 16,
						paddingVertical: 12,
						marginRight: 4,
						backgroundColor: Application.styles.white,
					}}
					onPress={() => {
						movePage(-1)
					}}
				>
					<Text
						style={{
							color: Application.styles.secondary,
							opacity: 0.3,
							fontWeight: "600",
						}}
						className="text-[36px] text-center"
					>
						{"<"}
					</Text>
				</TouchableOpacity>}
				<TouchableOpacity
					activeOpacity={0.5}
					style={{
						borderRadius: 16,
						paddingHorizontal: 32,
						paddingVertical: 12,
						backgroundColor: Application.styles.primary,
					}}
					onPress={() => {
						if (page == props.children.length-1) {
							const navigation = props.navigation
							if (navigation) {
								navigation.replace("home")
							} else {
								alert("navigation is null")
							}
						}
						movePage(1)
					}}
				>
					<Text
						style={{
							color: Application.styles.white,
							fontWeight: "600",
						}}
						className="text-[36px] text-center"
					>
						{page == props.children.length - 1 ? translations.screens.welcomer.lets_start : translations.screens.welcomer.next}
					</Text>
				</TouchableOpacity>
			</View>
			<View
				style={{
					width: "80%",
				}}
				className="flex-row my-2 justify-center gap-x-4"
			>
				{[...Array(props.children.length).keys()].map((e, i) => {
					const color = i <= page ? Application.styles.primary : Application.styles.secondary
					return (
						<View key={i} className="items-end justify-center">
							{i !== props.children.length - 1 ? (
								<View
									style={{
										height: 6,
										width: 18,
										left: 15,
										position: "absolute",
										backgroundColor: color,
										zIndex: 2,
									}}
								/>
							) : null}
							<View
								className="h-4 w-4"
								style={{
									backgroundColor: color,
									borderRadius: 100,
									zIndex: 3,
								}}
							>
							</View>
						</View>
					)
				})}
			</View>
		</View>
	)
}
