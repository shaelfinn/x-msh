import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
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
  likes: integer("likes").default(0).notNull(),
  impressions: integer("impressions").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
