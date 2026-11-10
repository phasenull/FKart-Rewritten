import API from "common/API"
import ApplicationConfig from "common/ApplicationConfig"
import CardImages from "common/enums/CardImages"
import CardTypes from "common/enums/CardTypes"
import { Favorite } from "common/interfaces/KentKart/Favorite"
import { BasicCardData } from "common/interfaces/KentKart/BasicCardData"

export default abstract class Card {
	public static getCardTypeFromCode(code: CardTypes): CardTypes {
		const map = {
			"00": CardTypes.full,
			"01": CardTypes.student,
			"02": CardTypes.age60,
			"03": CardTypes.age65,
			undefined: CardTypes.undefined,
			QR: CardTypes.QR,
		}
		return map[(code || "undefined") as keyof typeof map]
	}
	public static getImageFromType(card_type: CardTypes) {
		const type = Card.getCardTypeFromCode(card_type)
		return CardImages[type]
	}
	public static async getTypeFromAliasNo(alias_no:string) {
		if (alias_no.startsWith("33")||alias_no.startsWith("93")) return CardTypes.QR
		return await Card.getTypeFromCard({aliasNo:alias_no} as any)
	}
	public static async getTypeFromCard<T extends BasicCardData<"Basic" | "QR"> & Favorite<"Card" | "QR">>(card: T): Promise<CardTypes> {
		const card_alias = card.aliasNo || card.favorite || card.alias
		const is_virtual = card.type === "33" || card.cardType === "33" || card.virtualCard === "1"
		if (is_virtual) {
			await ApplicationConfig.database.set("card__" + card_alias,"QR")
			return CardTypes.QR
		}
		if (!card_alias) {
			throw new Error("Card alias is undefined " + JSON.stringify(card))
		}
		const data_on_db = await ApplicationConfig.database.get("card__" + card_alias)
		if (data_on_db) {
			return CardTypes[data_on_db as keyof typeof CardTypes] || CardTypes.undefined
		}
		return CardTypes.undefined
	}

	/**
	 * card type from the balance response's paxDescription ("TAM", "ÖĞRENCİ", …), case-insensitive.
	 * Turkish letters are lowered by hand: Hermes has no Turkish locale rules, and plain toLowerCase
	 * turns "İ" into "i" + a combining dot, so "ÖĞRENCİ" would never match "öğrenci".
	 * Verified: TAM, ÖĞRENCİ. Guessed, not seen yet: BASIN, 65, 60.
	 */
	public static typeFromPax(pax?: string): CardTypes | undefined {
		if (!pax) return undefined
		const text = pax.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase().replace(/\u0307/g, "").trim()
		// "ogrenc" also covers ASCII spellings like "OGRENCI" (its I lowers to ı)
		if (text.includes("öğrenc") || text.includes("ogrenc")) return CardTypes.student
		if (text.includes("basın") || text.includes("basin")) return CardTypes.press
		if (text.includes("65")) return CardTypes.age65
		if (text.includes("60")) return CardTypes.age60
		if (/(^|[^a-zçğıöşü])tam([^a-zçğıöşü]|$)/.test(text)) return CardTypes.full
		return undefined
	}
	/** the type picked by hand in the card's type picker, if any ("undefined" counts as none) */
	public static async getManualType(alias_no: string): Promise<CardTypes | undefined> {
		const value = await ApplicationConfig.database.get("card__" + alias_no)
		const type = value ? CardTypes[value as keyof typeof CardTypes] : undefined
		return type && type !== CardTypes.undefined ? type : undefined
	}

	public static async getImageFromCard<T extends BasicCardData<"Basic" | "QR"> & Favorite<"Card" | "QR">>(card: T): Promise<CardImages> {
		if (!card) {
			return CardImages.undefined
		}
		const type = await Card.getTypeFromCard(card)
		if (type === CardTypes.QR) return CardImages["QR"]
		return CardImages[type]
	}
}
