CREATE TYPE "public"."log_level" AS ENUM('info', 'warn', 'error', 'debug', 'fatel');--> statement-breakpoint
CREATE TABLE "logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trace_id" text NOT NULL,
	"parent_id" text,
	"span_id" text NOT NULL,
	"service" text NOT NULL,
	"level" "log_level",
	"message" text NOT NULL,
	"timestamp" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "trace_id_idx" ON "logs" USING btree ("trace_id");--> statement-breakpoint
CREATE INDEX "parent_id_idx" ON "logs" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "span_id_idx" ON "logs" USING btree ("span_id");--> statement-breakpoint
CREATE INDEX "level_idx" ON "logs" USING btree ("level");