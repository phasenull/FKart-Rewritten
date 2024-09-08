import { drizzleDB } from "app/_layout"

import { sql } from "drizzle-orm"
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core"
export type MixedTripyRoutyDisplayishThing = {
	type: "display",
	id:string
} | {
	type: "route",
	id:string
} | {
	type: "trip",
	id:string,
	route_code:string,
	time:string,
}
export const alarms = sqliteTable("alarms", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	label: text("label").notNull(),
	data: text("data", { mode: "json" }).$type<{
		range:number,
		type:"range"|"minutes"|"stops",
	}>(),
	type: text("type").$type<"reach" | "creation">().notNull().default("creation"),
	routes: text("routes", { mode: "json" }).notNull().default([]).$type<MixedTripyRoutyDisplayishThing[]>(),
	stops: text("stops", { mode: "json" }).$type<string[]>(),
})
