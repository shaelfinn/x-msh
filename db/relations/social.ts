import { relations } from "drizzle-orm";
import { user } from "../auth/user";
import { post } from "../social/post";
import { like } from "../social/like";
import { follow } from "../social/follow";
import { bookmark } from "../social/bookmark";
import { notification } from "../social/notification";

// User relations
export const userSocialRelations = relations(user, ({ many }) => ({
  posts: many(post),
  likes: many(like),
  bookmarks: many(bookmark),
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
  likes: many(like),
  bookmarks: many(bookmark),
  notifications: many(notification),
}));

// Like relations
export const likeRelations = relations(like, ({ one }) => ({
  user: one(user, {
    fields: [like.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [like.postId],
    references: [post.id],
  }),
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

// Bookmark relations
export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  user: one(user, {
    fields: [bookmark.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [bookmark.postId],
    references: [post.id],
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
