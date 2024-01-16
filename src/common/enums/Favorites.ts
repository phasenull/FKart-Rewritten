export interface Favorites {
	userFavorites: Array<Favorite<"Card" | "Route" | "Stop">>
	virtualCards: Array<Favorite<"QR">>
}

/**
@property {string} description
@property {number} favId
@property {string} favorite
@property {1 | 2 | 3 | "33"} type -- 1 Stop | 2 Card | 3 Route | 33 QR
@property {"Stop" | "Card" | "Route"} typeDescription
 */
export interface Favorite<T extends "QR" | "Card" | "Stop" | "Route"> {
	description: T extends "QR" ? never : string
	favId: T extends "QR" ? never : number
	alias: T extends "QR" ? string : never
	favorite: T extends "QR" ? never : string,
	type: T extends "QR" ? "33" : T extends "Card" ? 2 : T extends "Stop" ? 1 : 3
	typeDescription: T extends "QR" ? "QR" : T extends "Card" ? "Card" : T extends "Stop" ? "Stop" : "Route"
	vCardId: T extends "QR" ? string : never
}