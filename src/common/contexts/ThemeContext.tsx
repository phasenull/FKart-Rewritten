import { Children, createContext, useState } from "react"
import DarkTheme from "../../assets/themes/dark"
import LightTheme from "../../assets/themes/light"
import NightsWatchTheme from "../../assets/themes/nights_watch"
import { useColorScheme } from "react-native"

export interface ITheme {
	primary: string
	dark: string
	primaryDark: string
	secondary: string
	secondaryDark: string
	black: string
	white: string
	error: string
	success: string
}
export enum Theme {
	"LIGHT",
	"DARK",
	"NIGHT's WATCH",
}
export const ThemeContext = createContext<{ theme: ITheme; themeLabel: Theme; setThemeLabel: (theme: Theme) => void }>({} as any)
function getThemeFromLabel(label: Theme) {
	switch (label) {
		case Theme.DARK:
			return DarkTheme
		case Theme["NIGHT's WATCH"]:
			return NightsWatchTheme
		case Theme.LIGHT:
			return DarkTheme
		default:
			return DarkTheme
	}
}
export function ThemeProvider(props: { children: any }) {
	
	const colorScheme = useColorScheme()
	const [themeLabel, setThemeLabel] = useState<Theme>(colorScheme === "light" ? Theme.LIGHT : Theme.DARK)
	const [theme, setTheme] = useState(getThemeFromLabel(themeLabel))
	return <ThemeContext.Provider value={{ theme: theme, themeLabel: themeLabel, setThemeLabel: setThemeLabel }}>{props.children}</ThemeContext.Provider>
}
