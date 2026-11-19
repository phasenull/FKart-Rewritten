import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import AuthScreen from "components/auth_kk/AuthScreen"
import { Redirect } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useState } from "react"

export default function AuthPage() {
	// Only redirect if the user was already signed in when the page opened:
	// a fresh OTP sign up signs in first and then shows the profile step on this page.
	const [alreadySignedIn] = useState(() => !!useKentKartAuthStore.getState().credentials.access_token)
	if (alreadySignedIn) return <Redirect href={{ pathname: "/RootScreen" }} />
	return (
		<>
			<StatusBar style="light" />
			<AuthScreen />
		</>
	)
}
