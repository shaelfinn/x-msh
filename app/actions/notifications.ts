"use server";

import { db } from "@/db/drizzle";
import { notification, user, post } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getNotifications(filter: "all" | "mentions" = "all") {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return [];
    }

    // Build where clause based on filter
    const whereClause =
      filter === "mentions"
        ? and(
            eq(notification.recipientId, session.user.id),
            eq(notification.type, "mention"),
          )
        : eq(notification.recipientId, session.user.id);

    // Get notifications with sender info and post info
    const notifications = await db
      .select({
        id: notification.id,
        type: notification.type,
        read: notification.read,
        createdAt: notification.createdAt,
        postId: notification.postId,
        sender: {
          id: user.id,
          name: user.name,
          username: user.username,
          image: user.image,
        },
        post: {
          id: post.id,
          content: post.content,
        },
      })
      .from(notification)
      .innerJoin(user, eq(notification.senderId, user.id))
      .leftJoin(post, eq(notification.postId, post.id))
      .where(whereClause)
      .orderBy(desc(notification.createdAt));

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    await db
      .update(notification)
      .set({ read: true })
      .where(eq(notification.id, notificationId));

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    await db
      .update(notification)
      .set({ read: true })
      .where(eq(notification.recipientId, session.user.id));

    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}
