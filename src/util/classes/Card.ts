import Application from "../Application"
import CardImages from "../enums/CardImages"
import CardTypes from "../enums/CardTypes"

export default class Card {
	public alias: string
	public description?: string
	public favorite_id?: string
	public blacklist_status?: boolean
	public card_no?: string
	public card_type?: "00" | "01" | "02" | "03" | undefined
	public expire_date?: string
	public is_expired?: boolean
	public is_active?: boolean
	public is_personalized?: boolean
	public is_user_card?: boolean
	public is_virtual_card?: boolean
	public product_code?: string
	public system_id?: string
	public last_usages?: any[]
	public balance?: number
	public loads_in_line?: Array<any>

	constructor(alias: string) {
		this.alias = alias
		return this
	}
	public static FETCH_CARD_DATA({ region, alias, token }: { region: string; alias: string; token: string }) {
		const url = `https://service.kentkart.com/rl1/api/card/balance?region=${region}&lang=tr&authType=4&token=${token}&alias=${alias}`
		return Application.fetch(url)
	}
	public async fetchData() {
		const region = Application.region
		const token = Application.logged_user?.access_token
		const alias = this.alias
		if (!region || !token) throw new Error("Not logged in")
		const response = await Card.FETCH_CARD_DATA({ region: Application.region, alias: alias, token: token })
		if (!response.ok) throw new Error("Failed to fetch card data")
		const json = await response.json()
		// todo
		// const response2 = await Card.FETCH_CARD_DATA_FROM_FAVORITES({ region, token, alias })

		const card = this.loadFromJSON({ ...json?.cardlist[0] })
		return this
	}
	public static getCardTypeFromCode(code: "00" | "01" | "02" | "03" | undefined) : CardTypes {
		const map = {
			"00": CardTypes.full,
			"01": CardTypes.student,
			"02": CardTypes.age60,
			"03": CardTypes.age65,
			"undefined" : CardTypes.undefined,
			// random data since it doesn't matter
		}
		return map[code || "undefined"]
	}
	public getImage() {
		return CardImages[Card.getCardTypeFromCode(this.card_type)]
	}
	public loadFromJSON(json: any) {
		this.alias = json.aliasNo  || this.alias
		this.description = json.description || this.description
		this.favorite_id = json.favId || this.favorite_id
		this.blacklist_status = json.blacklistStatus === "1" ? true : false 
		this.card_no = json.cardNo || this.card_no
		this.card_type = this.card_type
		this.expire_date = json.expiredDate || this.expire_date
		this.is_expired = json.expiredStatus === "1" ? true : false 
		this.is_active = json.isActive === "1" ? true : false 
		this.is_personalized = json.isPersonalized === "1" ? true : false
		this.is_user_card = json.userCard === "1" ? true : false
		this.is_virtual_card = json.virtualCard === "1" ? true : false
		this.product_code = json.product_code || this.product_code
		this.system_id = json.systemId || this.system_id
		this.last_usages = json.usage || this.last_usages
		this.balance = json.balance || this.balance
		this.loads_in_line = json.oChargeList || this.loads_in_line
		return this
	}
}
