ALTER TABLE "users" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "currency" text DEFAULT 'USD' NOT NULL;