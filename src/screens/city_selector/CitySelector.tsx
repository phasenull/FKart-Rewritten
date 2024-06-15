import { MaterialCommunityIcons } from "@expo/vector-icons"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useGetCityList } from "common/hooks/kentkart/nonAuthHooks"
import { BaseKentKartResponse } from "common/interfaces/KentKart/BaseKentKartResponse"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import SecondaryText from "components/reusables/SecondaryText"
import { useContext, useState } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import Animated, { BounceIn, BounceInRight, LightSpeedInRight, LightSpeedOutRight, withSpring } from "react-native-reanimated"
import ErrorPage from "screens/ErrorPage"
const payment_images = {
	creditCard: "https://cdn-icons-png.flaticon.com/512/4547/4547723.png",
	bkmExpress: "https://logowik.com/content/uploads/images/620_bkmekspress.jpg",
	masterPass: "https://logowik.com/content/uploads/images/mastercard-masterpass2781.logowik.com.webp",
	sadad: "https://seeklogo.com/images/S/sadad-bahrain-logo-1D25E8C29C-seeklogo.com.png",
}
const image_mapping_testing = {
	"003":
		"https://www.kulturportali.gov.tr/repoKulturPortali/large/SehirRehberi//GezilecekYer/20190111110947922_THK%20ORHAN%20OZGULBAS%20ADANA%20Seyhan%20Nehri%20Taskopru%20logolu.jpg?format=jpg&quality=50",
	"019": "https://www.alanyum.com/uploads/sayfalar/large/f2b43383-4a5b-406c-ba76-742a7330c41b.jpg",
	"029": "https://alapli.bel.tr/img/yuklenen/buyuk-alapli-sahil-6045-1699351412.jpg",
	"026": "https://antalya.com.tr/Uploaded/Content/ac269abe-2a5c-4f57-8ae8-c61aad846792.jpg",
	"017": "https://www.butso.org.tr/images/english/Sagalassos.jpg",
	"007": "https://cdn-gaecj.nitrocdn.com/JMwuRIbFKRytZpZBQQGkRvqmTfGyKhHA/assets/images/optimized/rev-af281b9/turkeytravelplanner.com/wp-content/uploads/2024/02/canakkale-gallipoli-peninsula.jpg",
	"036": "https://cdnuploads.aa.com.tr/uploads/Contents/2022/04/19/thumbs_b_c_853917aac879db3aaacb96cc32554291.jpg?v=155251",
	"013": "https://www.jestur.com.tr/images/tour/802_b.jpg",
	"020": "https://img-s3.onedio.com/id-61ba876621c0d95e7f812785/rev-0/w-600/h-337/f-jpg/s-f6818bfc4379fec8a9ba9f962b2bbb7a142e3c75.jpg",
	"024": "https://gezimanya.com/sites/default/files/styles/800x600_/public/gezilecek-yerler/2019-11/image-4692759_orig.jpg",
	"027": "https://www.birucak.com/assets/Dosyalar/Resimler/24.04.2017/Buyuk/kirklareli-de-gezilecek-yerler.jpg",
	"028": "https://www.etstur.com/letsgo/wp-content/uploads/2018/08/gaziantep_1.jpg",
	"014": "https://www.etstur.com/letsgo/wp-content/uploads/2021/03/ispartada-gezilecek-yerler-tepe-1.jpg",
	"004": "https://www.bizevdeyokuz.com/wp-content/uploads/ormanya-hobbit-evleri.jpg",
	"032": "https://blog.biletbayi.com/wp-content/uploads/2020/02/mardin-panoramik-manzara-scaled.jpg",
	"010": "https://arenyachting.com/wp-content/uploads/2021/05/Muglada-Gezilecek-Yerler-11.jpg",
	"023": "https://www.nigdegazozu.com.tr/img/uretim-tesislerimiz.jpg",
	"025": "https://www.kucukoteller.com.tr/storage/images/2022/07/17/baa6eee0cfcf88ebb297b14e12dae46cfcf8dbe2.webp",
	"031": "https://karadenizturlari.com.tr/uploads/2021/12/orduda-gezilecek-yerler.jpg",
	"033": "https://blog.tatildenince.com/wp-content/uploads/2024/01/osmaniye-gezilecek-yerler.jpg",
	"037": "https://www.bellimatur.com/ekstra/blog/safranbolu-gezilecek-yerler---7-farkli-mekan-onerisi.jpg",
	"038": "https://blog.tatildukkani.com/wp-content/uploads/2023/02/erzurum-ulu-camii-scaled.jpeg",
	"005": "https://yiyegeze.com/wp-content/uploads/2020/07/Hobbit-Evleri.jpg",
	"011":
		"https://img.aydinlik.com.tr/rcman/Cw1280h720q95gc/storage/files/images/2023/04/27/yozgatta-gezilecek-yerler-listesi-ile-ilk-milli-parktan-essiz-roma-hamamina-yolculuk-yozgatta-gezilecek-yerler-yozgat-gezilecek-yerler-yozgat-gezilecek-jB4M.jpg",
}
export default function CitySelector(props:{navigation:NativeStackNavigationProp<any>}) {
	const { data: city_list, isError, error, isLoading, refetch, isRefetching, isRefetchError } = useGetCityList()
	const { theme } = useContext(ThemeContext)
	const [selected, setSelected] = useState<string | undefined>()
	const setRegion = useKentKartAuthStore((state) => state.setRegion)
	if (isLoading || isRefetching) {
		return <CustomLoadingIndicator size={48} color={theme.primary} />
	}
	if (isError || isRefetchError) {
		// cast cast cast, cast the error! cast cast cast, cast the error!
		return <ErrorPage retry={refetch} error={{ title: "Couldn't fetch city list", description: ((error as any)?.response?.data as BaseKentKartResponse).result?.message || (error as any).message }} />
	}

	return (
		<View className="flex-1 items-center" style={{ backgroundColor: "transparent" }}>
			<SecondaryText style={{ fontSize: 30 }}>select a city</SecondaryText>
			{selected ? (
				<Animated.View
					entering={BounceInRight.duration(500)}
					className="flex-row absolute items-center right-0 z-20 bottom-0 mb-6 mr-20 p-4 justify-between space-x-4"
					style={{ backgroundColor: theme.white, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }}
				>
					<SecondaryText>Selected: {city_list?.data.city.find((e) => e.id === selected)?.name}</SecondaryText>
					<TouchableOpacity
						activeOpacity={0.8}
						style={{
							backgroundColor: theme.success,
							borderRadius: 16,
							padding: 24,
							position: "absolute",
						}}
						className="-right-16"
						onPress={() => {
							setRegion(selected)
							if (props.navigation?.canGoBack()) {
								props.navigation.goBack()
							}
						}}
					>
						<MaterialCommunityIcons color={theme.white} name="check" size={24} />
					</TouchableOpacity>
				</Animated.View>
			) : null}
			<FlatList
				style={{
					backgroundColor: theme.white,
					width: "100%",
					// marginBottom: 40 * 4,
				}}
				contentContainerStyle={{
					rowGap: 0.5 * 4,
				}}
				data={city_list?.data?.city}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() => {
							if (selected === item.id) {
								return setSelected(undefined)
							}
							setSelected(item.id)
						}}
						activeOpacity={0.7}
						className="h-32 justify-center items-center"
					>
						{image_mapping_testing[item.id as keyof typeof image_mapping_testing] ? (
							<Image
								source={{
									uri: image_mapping_testing[item.id as keyof typeof image_mapping_testing],
								}}
								style={{
									height: "100%",
									width: "100%",
									objectFit: "cover",
									position: "absolute",
								}}
							/>
						) : null}
						<SecondaryText
							adjustsFontSizeToFit={true}
							numberOfLines={1}
							// className="bg-red-400"
							style={{
								width: "100%",
								textAlignVertical: "center",
								paddingLeft: 2 * 4,
								fontWeight: "400",
								fontSize: 200,
								color: image_mapping_testing[item.id as keyof typeof image_mapping_testing] ? theme.text.white : theme.text.secondary,
								textShadowRadius: 9,
							}}
						>
							{item.name} - {item.id}
						</SecondaryText>
					</TouchableOpacity>
				)}
			/>
			{/* <Text>
			{JSON.stringify(city_list?.data.city,undefined,4)}
		</Text> */}
		</View>
	)
}
