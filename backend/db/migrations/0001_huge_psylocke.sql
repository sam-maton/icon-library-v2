CREATE TABLE `organisation` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_organisation` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`organisationId` text NOT NULL,
	`admin` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organisationId`) REFERENCES `organisation`(`id`) ON UPDATE no action ON DELETE cascade
);
