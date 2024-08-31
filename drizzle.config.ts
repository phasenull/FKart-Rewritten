import type { Config } from "drizzle-kit"
export default {
	schema: "./src/common/schema.tsx",
	out: "./drizzle",
	dialect: "sqlite",
	driver: "expo", // <--- very important
} satisfies Config
