export interface BasicKentKartResponse {
	result: {
		authType: "4" | "3"
		cmd: string
		code: number
		dateTime: string
		debugTimeDiff: never
		message: "OK" | "FAIL"
	}
}
