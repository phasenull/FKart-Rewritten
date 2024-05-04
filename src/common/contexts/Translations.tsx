import { createContext, useState } from "react";
import { Langs } from "../enums/Langs";
import { TRANSLATIONS_EN } from "../../assets/translations/en";
import { TRANSLATIONS_TR } from "../../assets/translations/tr";

export const TranslationsContext = createContext<{
	lang:Langs,
	setLang:(language:Langs)=>void,
	translations:typeof TRANSLATIONS_EN
}>({} as any)
function getTranslationsFromLang(lang?:Langs) {
	switch (lang) {
		case Langs.tr:
			return TRANSLATIONS_TR
		case Langs.en:
			return TRANSLATIONS_EN
		default:
			return TRANSLATIONS_EN
	}
}
export function TranslationsProvider(props:{children:any}) {
	const [lang,setLang] = useState<Langs>(Langs.tr)
	const [translations,setTranslations] = useState<typeof TRANSLATIONS_EN>(getTranslationsFromLang(Langs.tr))
	return (
		<TranslationsContext.Provider value={{lang,setLang,translations}}>
			{props.children}
		</TranslationsContext.Provider>
	)
}