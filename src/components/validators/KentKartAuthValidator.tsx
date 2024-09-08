import { useContext } from "react"
import { Text, View } from "react-native"
import ApplicationConfig from "common/ApplicationConfig"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import useGetProfileData from "common/hooks/kentkart/user/useGetProfileData"
import SplashScreen from "app/SplashScreen"

export default function KentKartAuthValidator(props: { children: any; else?: any }) {
	const {data,isLoading} = useGetProfileData()
	const  user  = useKentKartAuthStore((state) => state.user)
	const  credentials  = useKentKartAuthStore((state) => state.credentials)

	if (!credentials.access_token) return props.else
	if (isLoading) return <SplashScreen logs={["fetching account info"]}/>
	if (!data?.data.accountInfo) return props.else
	if (user) {
		return props.children
	}
	return props.else
}
