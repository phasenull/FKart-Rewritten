ALTER TABLE `alarms` ADD `type` text DEFAULT 'arrival' NOT NULL;--> statement-breakpoint
ALTER TABLE `alarms` ADD `routes` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `alarms` ADD `stops` text;