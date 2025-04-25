CREATE TABLE `alarms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`data` text,
	`type` text DEFAULT 'creation' NOT NULL,
	`routes` text DEFAULT '[]' NOT NULL,
	`stops` text
);
--> statement-breakpoint
CREATE TABLE `app_cache` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text,
	`created_at` integer,
	`ttl` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_cache_key_unique` ON `app_cache` (`key`);--> statement-breakpoint
CREATE INDEX `index_app_cache_key` ON `app_cache` (`key`);