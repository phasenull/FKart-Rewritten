import { Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import ApplicationConfig from "common/ApplicationConfig"
import { useContext, useState } from "react"
import { FavoriteCardInputAliasModal } from "./FavoriteCardInputAliasModal"
import { useAddFavoriteCard } from "common/hooks/kentkart/cardHooks"
import useGetFavorites from "common/hooks/kentkart/user/useGetFavorites"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"

export function AddCard() {
	const {theme} = useContext(ThemeContext)
	const {refetch:refetchAccountFavorites} = useGetFavorites()
	const user = useKentKartAuthStore((state)=>state.user)
	if (!user) return
	const {isLoading,data,error,isError,mutateAsync} = useAddFavoriteCard()
	const [visible, setVisible] = useState(false)
	function onSave(alias:string) {
		setVisible(false)
		mutateAsync({alias_no:alias,name:`My Card - ${Math.floor(Math.random()*10)}`}).then(()=>refetchAccountFavorites())
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
