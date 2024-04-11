CREATE TABLE `lists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`listId` integer NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`listId`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE no action
);
