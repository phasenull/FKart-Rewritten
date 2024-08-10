export interface BasicCardData<T extends "QR" | "Basic"> {
	aliasNo: string
	balance: string
	cardNo: string
	systemId: string
	message: never
	expiredDate: never
	expiryDate: T extends "QR" ? string : never
	usage: [
		{
			amt: string
			type: 0 | 1
			date: string
			unixtime: number
		}
	]
	expiredStatus: "0" | "1"
	blacklistStatus: "0" | "1"
	product_code: string
	virtualCard: T extends "QR" ? "1" : "0"
	userCard: "0" | "1"
	isPersonalized: false
	creditCard: "0" | "1"
	isActive: "0" | "1"
	isTicket: "0" | "1"
	notificationLimit: never
	cardType: T extends "QR" ? "33" : "00"
	purchaseDate: T extends "QR" ? string : never
	ticketList: T extends "QR" ? Array<ITicket> : never
	paxDescription: T extends "QR" ? string : never
	loads_in_line: Array<Map<string, any>>
	oChargeList: Array<Map<string, any>>
}

export interface ITicket {
	activeStatus: "1" | "0"
	destinationId: ""
	expiredDate: string
	expiredStatus: "1"|"0"
	expiryDate: string
	originId: ""
	productName: ""
	product_code: "49"
	purchaseDate: string
	remainingCount: string
	ticketNo: string
	usageCount: "0"
}
