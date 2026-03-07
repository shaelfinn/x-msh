ALTER TABLE "post" RENAME COLUMN "likes" TO "likes_count";--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "liked_by" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "bookmarked_by" jsonb DEFAULT '[]'::jsonb NOT NULL;