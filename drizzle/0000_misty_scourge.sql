CREATE TABLE `invitations` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`contract_id` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_invitations_user_contract` ON `invitations` (`user_id`,`contract_id`);--> statement-breakpoint
CREATE TABLE `workspaces` (
	`user_id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL
);
