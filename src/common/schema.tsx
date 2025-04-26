import { drizzleDB } from "app/_layout"

import { sql } from "drizzle-orm"
import { text, integer, sqliteTable, int, index } from "drizzle-orm/sqlite-core"
export type MixedTripyRoutyDisplayishThing = {
	type: "display",
	id: string
} | {
	type: "route",
	id: string
} | {
	type: "trip",
	id: string,
	route_code: string,
	time: string,
}
export const alarms = sqliteTable("alarms", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	label: text("label").notNull(),
	data: text("data", { mode: "json" }).$type<{
		range: number,
		type: "range" | "minutes" | "stops",
	}>(),
	type: text("type").$type<"reach" | "creation">().notNull().default("creation"),
	routes: text("routes", { mode: "json" }).notNull().default([]).$type<MixedTripyRoutyDisplayishThing[]>(),
	stops: text("stops", { mode: "json" }).$type<string[]>(),
})
export const favorites = sqliteTable("favorites", {

	id: integer("id").primaryKey({ autoIncrement: true }),
	type: text("type").$type<"route" | "bus">(),
	description: text("description"),
	extras: text("extras", { mode: "json" }),
	created_at: int("created_at", { mode: "timestamp_ms" }).defaultNow()
})

export const app_cache = sqliteTable("app_cache", {
	key: text("key").primaryKey().unique().notNull(),
	value: text("value", { mode: "json" }),
	created_at: int("created_at", { mode: "timestamp_ms" }).defaultNow(),
	updated_at: int("created_at", { mode: "timestamp_ms" }),
	ttl: int("ttl"),
}, (table) => ({
	name_idx: index("index_app_cache_key").on(table.key)
})
)