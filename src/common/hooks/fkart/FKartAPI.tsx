import { ProperErrorHandling } from "common/util"
import NetworkWrapper from "../NetworkWrapper"
import ApplicationConfig from "common/ApplicationConfig"
import { useFKartAuthStore } from "common/stores/FKartAuthStore"
import BasicRouteInformation from "common/interfaces/KentKart/BasicRouteInformation"

export class FKartAPI extends NetworkWrapper {}

/*

LITERAL HELL

*/

export { FKART }
declare namespace FKART.types {
	interface AccountlessSession {
		id: string
		user_id: string | undefined
		sync_code: string
		ip: string
		created_at: number
		updated_at: number
	}
}
namespace FKART {
	export const FKartClient = new FKartAPI({
		requestModifier: (e) => ({
			...e,
			init: {
				...e.init,
				headers: {
					...e.init?.headers,
					"User-Agent": ApplicationConfig.getFormattedVersion(),
				},
			},
		}),
	})
}
const __temporary_return_value = [false, "feature work in progress"] as any
namespace FKART.services.api.accountless {
	export namespace create {
		export async function post(): Promise<ProperErrorHandling<{ accountless_session: FKART.types.AccountlessSession }>> {
			return __temporary_return_value
		}
	}
	export namespace link {
		async function post() {}
	}

	namespace settings {
		export async function get() {}
		export async function post() {}
	}
}
namespace FKART.services.api.seasons {
	export namespace get {
		export async function get(): Promise<ProperErrorHandling<{ season: "summer" | "winter"; since: number }>> {
			return [{ season: "summer", since: 0 }]
		}
	}
}

namespace FKART.services.static_data.kentkart {
	export namespace routes {
		export async function get(): Promise<ProperErrorHandling<{ city: number; routeList: BasicRouteInformation | []; fresh: boolean }>> {
			return __temporary_return_value
		}
	}
}

namespace FKART.services.editor {
	export namespace uploads {
		
	}
}