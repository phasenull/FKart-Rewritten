import BaseFKartResponse from "common/interfaces/FKart/BaseFKartResponse"
import { ProperErrorHandling } from "common/util"

export default class NetworkWrapper {
	private readonly __requestModifier: (args: { input: RequestInfo | URL; init?: RequestInit }) => { input: RequestInfo | URL; init?: RequestInit }
	constructor(args: {
		requestModifier?: (args: { input: RequestInfo | URL; init?: RequestInit }) => { input: RequestInfo | URL; init?: RequestInit }
		afterMath?: (args: { response: BaseFKartResponse }) => { response: BaseFKartResponse }
	}) {
		const { requestModifier } = args
		let target_function = requestModifier
		if (!target_function) target_function = (e) => e
		this.__requestModifier = target_function
	}
	async fetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<ProperErrorHandling<BaseFKartResponse & T>> {
		const { input: m_input, init: m_init } = this.__requestModifier({ input: input, init: init })
		let request
		let json
		let error
		try {
			request = await fetch(m_input, m_init)
		} catch (e) {
			error = e as string
		}
		if (!error && request) {
			try {
				json = await request.json()
			} catch (e) {
				error = e as string
				json = undefined
			}
		}
		if (error) return [false,error || "undefined error"]
		return [json]
	}
}
