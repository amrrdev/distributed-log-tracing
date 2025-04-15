ALTER TABLE "logs" ALTER COLUMN "timestamp" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "logs" ALTER COLUMN "timestamp" DROP NOT NULL;