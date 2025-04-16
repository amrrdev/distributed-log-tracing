CREATE TABLE "dags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trace_id" text NOT NULL,
	"root_span_id" text NOT NULL,
	"dag_json" jsonb NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "logs" CASCADE;--> statement-breakpoint
DROP TYPE "public"."log_level";