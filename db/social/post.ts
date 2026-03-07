import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { user } from "../auth/user";

export const postTypeEnum = ["offer", "hire", "collab", "info"] as const;

export const post = pgTable("post", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  parentId: text("parent_id"), // For comments/replies
  media: text("media").array(), // Array of image/video URLs
  type: text("type", { enum: postTypeEnum }).default("info"), // Gig type
  price: integer("price"), // Price in dollars (nullable)
  likedBy: jsonb("liked_by").$type<string[]>().default([]).notNull(), // Array of user IDs who liked
  bookmarkedBy: jsonb("bookmarked_by").$type<string[]>().default([]).notNull(), // Array of user IDs who bookmarked
  impressions: integer("impressions").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
