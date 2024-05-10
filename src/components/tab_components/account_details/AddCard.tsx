import { Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Application from "../../../common/Application"
import { useContext, useState } from "react"
import { FavoriteCardInputAliasModal } from "./FavoriteCardInputAliasModal"
import { useAddFavoriteCard } from "../../../common/hooks/kentkart/card/useRenameCard"
import useGetFavorites from "../../../common/hooks/kentkart/user/useGetFavorites"
import { ThemeContext } from "../../../common/contexts/ThemeContext"

export function AddCard() {
	const [alias,setAlias] = useState("")
	const {theme} = useContext(ThemeContext)
	const {refetch:refetchAccountFavorites} = useGetFavorites()
	const {refetch:refetchFavorite} = useAddFavoriteCard({card_or_fav_id:alias,name:"My Favorite Card"})
	const [visible, setVisible] = useState(false)
	function onSave(alias:string) {
		setAlias(alias)
		setVisible(false)
		refetchFavorite()
		refetchAccountFavorites({})
	}
	return (
		<View className="w-full mt-8 h-36 items-center justify-center">
			<FavoriteCardInputAliasModal onSave={onSave} visible={visible} onDismiss={()=>{setVisible(false)}}/>
			<TouchableOpacity
				className="w-24 h-24 items-center justify-center rounded-full"
				activeOpacity={0.5}
				onPress={() => {
					setVisible(true)
				}}
			>
				<MaterialCommunityIcons size={94} color={theme.secondary} style={{ opacity: 0.4 }} name="plus-circle" />
			<Text style={{
				color:theme.secondary,
				fontWeight:"800",
				fontSize:16,
				opacity:0.4
			}}>
				Add Card
			</Text>
			</TouchableOpacity>
		</View>
	)
}
