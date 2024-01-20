import IPoint from "./Point"

export interface ICityInformation {
	"id": string,
	"name": string,
	"lat": string,
	"lon": string,
	"initialRegion": IPoint
	"radius": string,
	"timezone": string,
	"visible": 1 | 0,
	"mCharge": string,
	"supportEmail": string,
	"paymentTypes": {
		"creditCard": boolean,
		"bkmExpress": boolean,
		"masterPass": boolean,
		"sadad": boolean
	},
	"panic": "0" | "1",
	"trip": "0" | "1",
	"nfc": "0" | "1",
	"oCharge": "0" | "1"
}