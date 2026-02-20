import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { user } from "../auth/user";
import { post } from "./post";

export const notification = pgTable("notification", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // 'like', 'reply', 'follow', 'mention'
  recipientId: text("recipient_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  senderId: text("sender_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  postId: text("post_id").references(() => post.id, { onDelete: "cascade" }),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
