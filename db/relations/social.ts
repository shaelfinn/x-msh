import { relations } from "drizzle-orm";
import { user } from "../auth/user";
import { post } from "../social/post";
import { follow } from "../social/follow";
import { notification } from "../social/notification";

// User relations
export const userSocialRelations = relations(user, ({ many }) => ({
  posts: many(post),
  followers: many(follow, { relationName: "following" }),
  following: many(follow, { relationName: "follower" }),
  sentNotifications: many(notification, { relationName: "sender" }),
  receivedNotifications: many(notification, { relationName: "recipient" }),
}));

// Post relations
export const postRelations = relations(post, ({ one, many }) => ({
  author: one(user, {
    fields: [post.authorId],
    references: [user.id],
  }),
  parent: one(post, {
    fields: [post.parentId],
    references: [post.id],
    relationName: "comments",
  }),
  comments: many(post, { relationName: "comments" }),
  notifications: many(notification),
}));

// Follow relations
export const followRelations = relations(follow, ({ one }) => ({
  follower: one(user, {
    fields: [follow.followerId],
    references: [user.id],
    relationName: "follower",
  }),
  following: one(user, {
    fields: [follow.followingId],
    references: [user.id],
    relationName: "following",
  }),
}));

// Notification relations
export const notificationRelations = relations(notification, ({ one }) => ({
  recipient: one(user, {
    fields: [notification.recipientId],
    references: [user.id],
    relationName: "recipient",
  }),
  sender: one(user, {
    fields: [notification.senderId],
    references: [user.id],
    relationName: "sender",
  }),
  post: one(post, {
    fields: [notification.postId],
    references: [post.id],
  }),
}));
