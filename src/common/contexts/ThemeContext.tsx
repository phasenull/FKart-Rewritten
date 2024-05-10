import { Children, createContext, useState } from "react"
import DarkTheme from "../../assets/themes/dark"
import LightTheme from "../../assets/themes/light"
import NightsWatchTheme from "../../assets/themes/nights_watch"

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
	const [themeLabel, setThemeLabel] = useState<Theme>(Theme.LIGHT)
	const [theme, setTheme] = useState(getThemeFromLabel(themeLabel))
	return <ThemeContext.Provider value={{ theme: theme, themeLabel: themeLabel, setThemeLabel: setThemeLabel }}>{props.children}</ThemeContext.Provider>
}
