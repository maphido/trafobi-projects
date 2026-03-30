ALTER TABLE "projects" ADD COLUMN "is_research" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "experience" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "expertise" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "available_as_expert" boolean DEFAULT false NOT NULL;