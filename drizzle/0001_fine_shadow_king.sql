CREATE TABLE `answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitId` int NOT NULL,
	`questionId` int NOT NULL,
	`answerText` text,
	`answerNumber` int,
	`answerBoolean` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `engineers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`specialization` varchar(255),
	`phone` varchar(50),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `engineers_id` PRIMARY KEY(`id`),
	CONSTRAINT `engineers_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitId` int NOT NULL,
	`questionId` int,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` varchar(1024) NOT NULL,
	`mimeType` varchar(100),
	`fileSize` int,
	`caption` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questionnaires` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`isActive` int NOT NULL DEFAULT 1,
	`createdById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questionnaires_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionnaireId` int NOT NULL,
	`questionText` text NOT NULL,
	`questionType` enum('text','number','boolean','photo') NOT NULL,
	`isRequired` int NOT NULL DEFAULT 0,
	`requiresPhoto` int NOT NULL DEFAULT 0,
	`photoInstructions` text,
	`orderIndex` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitId` int NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` varchar(1024) NOT NULL,
	`sentToClient` int NOT NULL DEFAULT 0,
	`sentToEngineer` int NOT NULL DEFAULT 0,
	`uploadedToOpenSolar` int NOT NULL DEFAULT 0,
	`viabilityScore` int,
	`viabilityNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`),
	CONSTRAINT `reports_visitId_unique` UNIQUE(`visitId`)
);
--> statement-breakpoint
CREATE TABLE `technicalVisits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uniqueToken` varchar(64) NOT NULL,
	`questionnaireId` int NOT NULL,
	`engineerId` int,
	`clientName` varchar(255),
	`clientEmail` varchar(320),
	`clientPhone` varchar(50),
	`address` text,
	`openSolarProjectId` varchar(255),
	`status` enum('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `technicalVisits_id` PRIMARY KEY(`id`),
	CONSTRAINT `technicalVisits_uniqueToken_unique` UNIQUE(`uniqueToken`)
);
