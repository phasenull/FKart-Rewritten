import { useContext } from "react"
import { Text, View } from "react-native"
import ApplicationConfig from "common/ApplicationConfig"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import useGetProfileData from "common/hooks/kentkart/user/useGetProfileData"

export default function KentKartAuthValidator(props: { children: any; else?: any }) {
	const {data} = useGetProfileData()
	const  user  = useKentKartAuthStore((state) => state.user)
	const  credentials  = useKentKartAuthStore((state) => state.credentials)
	if (!credentials.access_token || !data?.data.accountInfo) return props.else || null
	if (user) {
		return props.children
	}
	return props.else || null
}
