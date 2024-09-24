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

	public static async getImageFromCard<T extends BasicCardData<"Basic" | "QR"> & Favorite<"Card" | "QR">>(card: T): Promise<CardImages> {
		if (!card) {
			return CardImages.undefined
		}
		const type = await Card.getTypeFromCard(card)
		if (type === CardTypes.QR) return CardImages["QR"]
		return CardImages[type]
	}
}
