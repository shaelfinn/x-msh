"use server";

import { db } from "@/db/drizzle";
import { user, follow, post, notification } from "@/db/schema";
import { eq, and, sql, isNull, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function getUserProfile(username: string) {
  try {
    // Get user by username
    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.username, username))
      .limit(1);

    if (userResult.length === 0) {
      return null;
    }

    const userData = userResult[0];

    // Get followers count
    const followersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(follow)
      .where(eq(follow.followingId, userData.id));

    // Get following count
    const followingResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(follow)
      .where(eq(follow.followerId, userData.id));

    const followersCount = Number(followersResult[0]?.count || 0);
    const followingCount = Number(followingResult[0]?.count || 0);

    // Get current session to check if viewing own profile
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const isOwnProfile = session?.user.id === userData.id;

    // Check if current user is following this profile
    let isFollowing = false;
    if (session && !isOwnProfile) {
      const followResult = await db
        .select()
        .from(follow)
        .where(
          and(
            eq(follow.followerId, session.user.id),
            eq(follow.followingId, userData.id),
          ),
        )
        .limit(1);

      isFollowing = followResult.length > 0;
    }

    return {
      id: userData.id,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      image: userData.image,
      cover: userData.cover,
      bio: userData.bio,
      location: userData.location,
      website: userData.website,
      country: userData.country,
      createdAt: userData.createdAt,
      followersCount,
      followingCount,
      isOwnProfile,
      isFollowing,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function getUserPosts(userId: string) {
  try {
    // Get posts by user (only top-level posts, not comments)
    const posts = await db
      .select({
        id: post.id,
        content: post.content,
        media: post.media,
        likes: post.likes,
        impressions: post.impressions,
        createdAt: post.createdAt,
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
          image: user.image,
        },
      })
      .from(post)
      .innerJoin(user, eq(post.authorId, user.id))
      .where(and(eq(post.authorId, userId), isNull(post.parentId)))
      .orderBy(desc(post.createdAt));

    // Get comments count for each post
    const postsWithCounts = await Promise.all(
      posts.map(async (p) => {
        const commentsResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(post)
          .where(eq(post.parentId, p.id));

        const commentsCount = Number(commentsResult[0]?.count || 0);

        return {
          ...p,
          commentsCount,
        };
      }),
    );

    return postsWithCounts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
}

export async function updateProfile(formData: FormData) {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;
    const imageFile = formData.get("image") as File | null;
    const coverFile = formData.get("cover") as File | null;

    if (!name?.trim()) {
      return { success: false, error: "Name is required" };
    }

    const updateData: {
      name: string;
      bio: string;
      location: string;
      website: string;
      image?: string;
      cover?: string;
    } = {
      name: name.trim(),
      bio: bio.trim(),
      location: location.trim(),
      website: website.trim(),
    };

    // Upload image to Vercel Blob if provided
    if (imageFile && imageFile.size > 0) {
      const blob = await put(
        `avatars/${session.user.id}-${Date.now()}.${imageFile.name.split(".").pop()}`,
        imageFile,
        {
          access: "public",
        },
      );
      updateData.image = blob.url;
    }

    // Upload cover to Vercel Blob if provided
    if (coverFile && coverFile.size > 0) {
      const blob = await put(
        `covers/${session.user.id}-${Date.now()}.${coverFile.name.split(".").pop()}`,
        coverFile,
        {
          access: "public",
        },
      );
      updateData.cover = blob.url;
    }

    // Update user in database
    await db.update(user).set(updateData).where(eq(user.id, session.user.id));

    // Revalidate the profile page
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (currentUser[0]?.username) {
      revalidatePath(`/${currentUser[0].username}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function toggleFollow(userId: string) {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    if (session.user.id === userId) {
      return { success: false, error: "Cannot follow yourself" };
    }

    // Check if already following
    const existingFollow = await db
      .select()
      .from(follow)
      .where(
        and(
          eq(follow.followerId, session.user.id),
          eq(follow.followingId, userId),
        ),
      )
      .limit(1);

    if (existingFollow.length > 0) {
      // Unfollow
      await db
        .delete(follow)
        .where(
          and(
            eq(follow.followerId, session.user.id),
            eq(follow.followingId, userId),
          ),
        );

      // Delete follow notification
      await db
        .delete(notification)
        .where(
          and(
            eq(notification.type, "follow"),
            eq(notification.senderId, session.user.id),
            eq(notification.recipientId, userId),
          ),
        );

      return { success: true, isFollowing: false };
    } else {
      // Follow
      await db.insert(follow).values({
        followerId: session.user.id,
        followingId: userId,
      });

      // Create notification
      const notificationId = `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      await db.insert(notification).values({
        id: notificationId,
        type: "follow",
        recipientId: userId,
        senderId: session.user.id,
        postId: null,
        read: false,
      });

      return { success: true, isFollowing: true };
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    return { success: false, error: "Failed to update follow status" };
  }
}
