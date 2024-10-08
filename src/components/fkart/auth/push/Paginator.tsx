import React, { useContext, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"

import { ThemeContext } from "common/contexts/ThemeContext"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import SelectLangModal from "components/reusables/SelectLangModal"
import { router } from "expo-router"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
export function Paginator(props: { initialIndex?: number; onPageChange?: (newIndex: number, previousIndex?: number) => void; children: any }) {
	// console.log("IIPaginator Update",props?.children?.length)
	const [page, setPage] = useState(props.initialIndex || 0)
	function movePage(dir: -1 | 1) {
		const result = Math.max(0, Math.min(page + dir, props.children.length - 1))
		setPage(result)
	}
	const { theme } = useContext(ThemeContext)
	const { translations, setLang, lang } = useContext(TranslationsContext)
	const [showTranslationSelector, setShowTranslationSelector] = useState(false)
	return (
		<View className="flex-1 justify-between items-center">
			<SelectLangModal defaultValue={lang} onDismiss={() => setShowTranslationSelector(false)} visible={showTranslationSelector} onSelect={setLang} />
			<TouchableOpacity style={{ backgroundColor: theme.white, borderRadius: 16 }} className="p-4 absolute self-center mt-4" onPress={() => setShowTranslationSelector(true)}>
				<MaterialCommunityIcons name="translate" color={theme.secondary} size={48} />
			</TouchableOpacity>
			<View className="flex-1">
				{props.children[page] || (
					<View className={"items-center"}>
						<Text>error at index {page}</Text>
					</View>
				)}
			</View>
			<View className="flex-row w-80 mt-4 justify-center mb-4 gap-x-2">
				{page == 0 ? null : (
					<TouchableOpacity
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
					</TouchableOpacity>
				)}
				<TouchableOpacity
					activeOpacity={0.5}
					style={{
						borderRadius: 16,
						paddingHorizontal: 32,
						paddingVertical: 12,
						backgroundColor: theme.primary,
					}}
					onPress={() => {
						if (page == props.children.length - 1) {
							router.navigate("/RootScreen")
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
						{page == props.children.length - 1 ? translations.ok : translations.screens.welcomer.next}
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
					const color = i <= page ? theme.primary : theme.secondary
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
							></View>
						</View>
					)
				})}
			</View>
		</View>
	)
}
