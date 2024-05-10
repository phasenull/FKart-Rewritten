import { Children, createContext, useEffect, useState } from "react"
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
	text:{
		primary:string,
		secondary:string,
		white:string,
	}
}
export enum Theme {
	"LIGHT"="LIGHT",
	"DARK"="DARK",
	"NIGHT's WATCH"="NIGHT's WATCH",
}
export const ThemeContext = createContext<{ theme: ITheme; themeLabel: Theme; setThemeLabel: (theme: Theme) => void }>({} as any)
function getThemeFromLabel(label: Theme) {
	switch (label) {
		case Theme.DARK:
			return DarkTheme
		case Theme["NIGHT's WATCH"]:
			return NightsWatchTheme
		case Theme.LIGHT:
			return LightTheme
		default:
			return LightTheme
	}
}
export function ThemeProvider(props: { children: any }) {
	
	const colorScheme = useColorScheme()
	// const [themeLabel, setThemeLabel] = useState<Theme>(colorScheme === "light" ? Theme.LIGHT : Theme.DARK)
	const [themeLabel, setThemeLabel] = useState<Theme>(Theme.LIGHT)
	// useEffect(()=>{
	// 	const new_label = colorScheme === "light" ? Theme.LIGHT : Theme.DARK
	// 	setThemeLabel(new_label)
	// 	setTheme(getThemeFromLabel(new_label))
	// 	console.log(new_label,colorScheme)
	// },[colorScheme])
	const [theme, setTheme] = useState(getThemeFromLabel(themeLabel))
	return <ThemeContext.Provider value={{ theme: theme, themeLabel: themeLabel, setThemeLabel: setThemeLabel }}>{props.children}</ThemeContext.Provider>
}
