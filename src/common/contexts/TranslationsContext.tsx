import { createContext, useEffect, useState } from "react"
import { Langs } from "../enums/Langs"
import TRANSLATIONS_EN from "../../assets/translations/en"
import TRANSLATIONS_TR from "../../assets/translations/tr"
import TRANSLATIONS_DE from "../../assets/translations/de"
import TRANSLATIONS_AR from "../../assets/translations/ar"
import TRANSLATIONS_AZ from "../../assets/translations/az"
import TRANSLATIONS_ES from "../../assets/translations/es"
import TRANSLATIONS_PIRATE from "../../assets/translations/pirate"

export const TranslationsContext = createContext<{
	lang: Langs
	setLang: (language: Langs) => void
	translations: typeof TRANSLATIONS_EN
}>({} as any)
export function getTranslationsFromLang(lang?: Langs) {
	switch (lang) {
		case Langs.tr:
			return TRANSLATIONS_TR
		case Langs.en:
			return TRANSLATIONS_EN
		case Langs.de:
			return TRANSLATIONS_DE
		case Langs.ar:
			return TRANSLATIONS_AR
		case Langs.az:
			return TRANSLATIONS_AZ
		case Langs.es:
			return TRANSLATIONS_ES
		case Langs.pirate:
			return TRANSLATIONS_PIRATE
		default:
			return TRANSLATIONS_EN
	}
}
export function TranslationsProvider(props: { children: any }) {
	const [lang, setLang] = useState<Langs>(Langs.tr)
	const [translations, setTranslations] = useState<typeof TRANSLATIONS_EN>(getTranslationsFromLang(Langs.tr))
	useEffect(()=>{
		setTranslations(getTranslationsFromLang(lang))
	},[lang])
	return <TranslationsContext.Provider value={{ lang, setLang, translations }}>{props.children}</TranslationsContext.Provider>
}
