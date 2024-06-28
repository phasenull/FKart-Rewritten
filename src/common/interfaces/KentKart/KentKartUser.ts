export interface IKentKartUser {
	accountCreateDate: string
	accountId: string
	activationStatus: "1" | "0"
	additional_info: null
	cCardExprMonth: string | ""
	cCardExprYear: string | ""
	cCardNo: string | ""
	country_code: "tr"
	datetime: string | ""
	email: string
	file_url: string | ""
	home: {
		latitude: number
		longitude: number
	}
	identityNo: string
	name: string
	nfcCardNo: string | ""
	payment_type: string | ""
	phone: string | ""
	runningTime: string | ""
	surname: string | ""
	systemid: string | ""
	timeDiff: string | ""
	user_id: string | ""
	work: {
		latitude: number
		longitude: number
	}
	access_token:string
}