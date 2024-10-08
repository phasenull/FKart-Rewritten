import ApplicationConfig from "common/ApplicationConfig";
import React, { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { ThemeContext } from "common/contexts/ThemeContext";
import { TranslationsContext } from "common/contexts/TranslationsContext";
import SelectLangModal from "components/reusables/SelectLangModal";
import { router } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ErrorPage from "../../app/ErrorPage";
export function IIPaginator(props: {initialIndex?: number; onPageChange?: (newIndex: number, previousIndex?: number) => void; children: any }) {
	// console.log("IIPaginator Update",props?.children?.length)
	const [page, setPage] = useState(props.initialIndex || 0)
	function movePage(dir: -1 | 1) {
		const result = Math.max(0, Math.min(page + dir, children.length - 1))
		setPage(result)
	}
	const {theme} = useContext(ThemeContext)
	const {translations,setLang,lang} = useContext(TranslationsContext)
	const [showTranslationSelector,setShowTranslationSelector] = useState(false)
	const [dontShowAgain, setDontShowAgain] = useState(false)
	useEffect(()=>{
		ApplicationConfig.database.set("settings.dont_show_welcomer_screen",dontShowAgain)
	},[dontShowAgain])
	const children = props.children?.filter((e:any)=>!!e)
	return (
		<View className="flex-1 justify-between items-center">
			<SelectLangModal defaultValue={lang} onDismiss={()=>setShowTranslationSelector(false)} visible={showTranslationSelector} onSelect={setLang} />
			<TouchableOpacity style={{backgroundColor:theme.white,borderRadius:16}} className="p-4 absolute self-center mt-12" onPress={()=>setShowTranslationSelector(true)}>
				<MaterialCommunityIcons name="translate" color={theme.secondary} size={48}/>
			</TouchableOpacity>
			<View className="flex-1">
				{children[page] || (
					<ErrorPage error={{
						title:`Error at page index ${page}`,
						description:`page is undefined`
					}} />
				)}
			</View>
			{page == children.length - 1 ? (
				<TouchableOpacity
					onPress={() => {
						setDontShowAgain(!dontShowAgain)
					}}
					className="flex-row px-8 py-6 -bottom-4 gap-x-1 items-center justify-center"
				>
					<MaterialCommunityIcons
						name={dontShowAgain ? "checkbox-marked-outline" : "checkbox-blank-outline"}
						style={{ opacity: dontShowAgain ? 1 : 0.4, color: dontShowAgain ? theme.primary : theme.secondary }}
						size={22}
					/>
					<Text style={{ fontWeight: "800", fontSize: 16, color: theme.secondary, opacity: 0.4 }}>{translations.screens.welcomer.dont_show_again}</Text>
				</TouchableOpacity>
			) : null}
			<View className="flex-row w-80 mt-4 justify-center mb-4 gap-x-2">
				{page == 0 ? null : <TouchableOpacity
					style={{
						borderRadius: 16,
						paddingHorizontal: 16,
						paddingVertical: 12,
						marginRight: 4,
						backgroundColor: theme.white,
					}}
					onPress={() => {
						movePage(-1)
					}}
				>
					<Text
						style={{
							color: theme.secondary,
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
						backgroundColor: theme.primary,
					}}
					onPress={() => {
						if (page == children.length-1) {
							router.replace({pathname:"/RootScreen"})
						}
						movePage(1)
					}}
				>
					<Text
						style={{
							color: theme.white,
							fontWeight: "600",
						}}
						className="text-[36px] text-center"
					>
						{page == children.length - 1 ? translations.screens.welcomer.lets_start : translations.screens.welcomer.next}
					</Text>
				</TouchableOpacity>
			</View>
			<View
				style={{
					width: "80%",
				}}
				className="flex-row my-2 justify-center gap-x-4"
			>
				{[...Array(children.length).keys()].map((e, i) => {
					const color = i <= page ? theme.primary : theme.secondary
					return (
						<View key={i} className="items-end justify-center">
							{i !== children.length - 1 ? (
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
								{/* <Text>hello there!</Text> */}
							</View>
						</View>
					)
				})}
			</View>
		</View>
	)
}
