// NOT: Kullanımlar term'den itibaren günümüze kadar tamamen listeleniyor
// fakat sadece o term'de gerçekleşen dolumlar dönüyor

// data en eski 30/05/2023'a kadar gidiyor
export default interface CardTransaction<T extends ["Dolum","Kullanım"]> {
	// ORTAK
	"formattedDate": string,
	"isCancel": boolean,
	"unixtime": number,
	"description": T,
	"colorType": "0",
	"name": T extends "Kullanım" ? "Kullanım" : string,
	"type": T extends "Kullanım" ? "1" : "0",
	
	// KULLANIM
	"checkInAmount": T extends "Kullanım" ? string : never,
	"checkInFormattedDate": T extends "Kullanım" ? string : never,
	"refundAmount": T extends "Kullanım" ? string : never,
	"refundFormattedDate": T extends "Kullanım" ? string : never
	"boardingDateTime": T extends "Kullanım" ? string : never,
	"lineEndName": " ",
	"lineStartName": "Kullanım",
	"routeCode": "-",
	"usageAmt": "7.00",
	
	// DOLUM
	"datetime": T extends "Dolum" ? string : never,
	"rfcardBalance": T extends "Dolum" ? string : never,
	"rfcardOldBalance": T extends "Dolum" ? string : never,
	"rtc": T extends "Dolum" ? string : never,
	"termNo": T extends "Dolum" ? string : never,
	"amount":T extends "Dolum" ? string : never,
	"subtype": T extends "Dolum" ? "CH" : never,
}