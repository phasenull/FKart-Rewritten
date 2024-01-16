import API from "../API"
import Application from "../Application"
import CardImages from "../enums/CardImages"
import CardTypes from "../enums/CardTypes"
import { Favorite } from "../enums/Favorites"
import { BasicCardData } from "../interfaces/BasicCardData"

export default class Card {
	public static getCardTypeFromCode(code: "00" | "01" | "02" | "03" | "QR" | undefined) : CardTypes {
		const map = {
			"00": CardTypes.full,
			"01": CardTypes.student,
			"02": CardTypes.age60,
			"03": CardTypes.age65,
			"undefined" : CardTypes.undefined,
			"QR": CardTypes.QR,
		}
		return map[(code || "undefined") as keyof typeof map]
	}
	public static getImageFromType(card_type : "00" | "01" | "02" | "03" | "QR" | undefined) {
		const type = Card.getCardTypeFromCode(card_type)
		return CardImages[type]
	}
	
}
