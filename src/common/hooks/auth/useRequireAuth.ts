import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { router } from "expo-router"

/** true when a KentKart session exists (incognito = false) */
export function useIsSignedIn() {
	return useKentKartAuthStore((state) => !!state.credentials?.access_token)
}

/** opens the sign in page on top of the current screen; it comes back here after signing in */
export function openSignIn() {
	router.push({ pathname: "/auth_kk" })
}

/**
 * Incognito mode: screens stay open, only the action that needs an account asks for one.
 * `requireAuth(action)` runs the action when signed in, otherwise opens the sign in page.
 */
export function useRequireAuth() {
	const signedIn = useIsSignedIn()
	return (action?: () => void) => {
		if (signedIn) action?.()
		else openSignIn()
	}
}
