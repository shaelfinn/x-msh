"use server";

import { db } from "@/db/drizzle";
import { post, user, like, bookmark } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, isNull, desc, sql, and } from "drizzle-orm";

export async function createPost(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const content = formData.get("content") as string;
    const mediaUrls = formData.getAll("mediaUrls") as string[];

    if (!content?.trim()) {
      return { success: false, error: "Content is required" };
    }

    if (content.length > 280) {
      return { success: false, error: "Content exceeds 280 characters" };
    }

    // Create post in database - generate Twitter-style numeric ID
    const postId = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;

    const postData: {
      id: string;
      content: string;
      authorId: string;
      parentId: null;
      likes: number;
      impressions: number;
      media?: string[];
    } = {
      id: postId,
      content: content.trim(),
      authorId: session.user.id,
      parentId: null,
      likes: 0,
      impressions: 0,
    };

    // Only add media if there are images
    if (mediaUrls.length > 0) {
      postData.media = mediaUrls;
    }

    await db.insert(post).values(postData);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating post:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create post";
    return { success: false, error: errorMessage };
  }
}

export async function getPosts(userId?: string) {
  try {
    // Get all posts with comment counts in a single query using subquery
    const posts = await db
      .select({
        id: post.id,
        content: post.content,
        media: post.media,
        likes: post.likes,
        impressions: post.impressions,
        createdAt: post.createdAt,
        commentsCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${post} AS comments 
          WHERE comments.parent_id = ${post.id}
        )`,
        isLiked: userId
          ? sql<boolean>`EXISTS(
              SELECT 1 FROM ${like} 
              WHERE ${like.userId} = ${userId} 
              AND ${like.postId} = ${post.id}
            )`
          : sql<boolean>`false`,
        isBookmarked: userId
          ? sql<boolean>`EXISTS(
              SELECT 1 FROM ${bookmark} 
              WHERE ${bookmark.userId} = ${userId} 
              AND ${bookmark.postId} = ${post.id}
            )`
          : sql<boolean>`false`,
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
          image: user.image,
          bio: user.bio,
        },
      })
      .from(post)
      .innerJoin(user, eq(post.authorId, user.id))
      .where(isNull(post.parentId))
      .orderBy(desc(post.createdAt))
      .limit(50);

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostById(postId: string, userId?: string) {
  try {
    const result = await db
      .select({
        id: post.id,
        content: post.content,
        media: post.media,
        likes: post.likes,
        impressions: post.impressions,
        createdAt: post.createdAt,
        commentsCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${post} AS comments 
          WHERE comments.parent_id = ${post.id}
        )`,
        isLiked: userId
          ? sql<boolean>`EXISTS(
              SELECT 1 FROM ${like} 
              WHERE ${like.userId} = ${userId} 
              AND ${like.postId} = ${post.id}
            )`
          : sql<boolean>`false`,
        isBookmarked: userId
          ? sql<boolean>`EXISTS(
              SELECT 1 FROM ${bookmark} 
              WHERE ${bookmark.userId} = ${userId} 
              AND ${bookmark.postId} = ${post.id}
            )`
          : sql<boolean>`false`,
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
          image: user.image,
        },
      })
      .from(post)
      .innerJoin(user, eq(post.authorId, user.id))
      .where(eq(post.id, postId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function getPostComments(postId: string) {
  try {
    const comments = await db
      .select({
        id: post.id,
        content: post.content,
        media: post.media,
        likes: post.likes,
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
      .where(eq(post.parentId, postId))
      .orderBy(desc(post.createdAt));

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    if (!content?.trim()) {
      return { success: false, error: "Content is required" };
    }

    if (content.length > 280) {
      return { success: false, error: "Content exceeds 280 characters" };
    }

    const commentId = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;

    await db.insert(post).values({
      id: commentId,
      content: content.trim(),
      authorId: session.user.id,
      parentId: postId,
      likes: 0,
      impressions: 0,
    });

    revalidatePath(`/[username]/post/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating comment:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create comment";
    return { success: false, error: errorMessage };
  }
}

export async function toggleLike(postId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if already liked
    const existingLike = await db
      .select()
      .from(like)
      .where(and(eq(like.userId, session.user.id), eq(like.postId, postId)))
      .limit(1);

    if (existingLike.length > 0) {
      // Unlike
      await db
        .delete(like)
        .where(and(eq(like.userId, session.user.id), eq(like.postId, postId)));

      // Decrement likes count
      await db
        .update(post)
        .set({ likes: sql`${post.likes} - 1` })
        .where(eq(post.id, postId));

      revalidatePath("/");
      return { success: true, liked: false };
    } else {
      // Like
      await db.insert(like).values({
        userId: session.user.id,
        postId: postId,
      });

      // Increment likes count
      await db
        .update(post)
        .set({ likes: sql`${post.likes} + 1` })
        .where(eq(post.id, postId));

      revalidatePath("/");
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

export async function toggleBookmark(postId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if already bookmarked
    const existingBookmark = await db
      .select()
      .from(bookmark)
      .where(
        and(eq(bookmark.userId, session.user.id), eq(bookmark.postId, postId)),
      )
      .limit(1);

    if (existingBookmark.length > 0) {
      // Remove bookmark
      await db
        .delete(bookmark)
        .where(
          and(
            eq(bookmark.userId, session.user.id),
            eq(bookmark.postId, postId),
          ),
        );

      revalidatePath("/");
      return { success: true, bookmarked: false };
    } else {
      // Add bookmark
      await db.insert(bookmark).values({
        userId: session.user.id,
        postId: postId,
      });

      revalidatePath("/");
      return { success: true, bookmarked: true };
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false, error: "Failed to toggle bookmark" };
  }
}

export async function checkUserLikedPost(postId: string, userId: string) {
  try {
    const result = await db
      .select()
      .from(like)
      .where(and(eq(like.userId, userId), eq(like.postId, postId)))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("Error checking like:", error);
    return false;
  }
}

export async function checkUserBookmarkedPost(postId: string, userId: string) {
  try {
    const result = await db
      .select()
      .from(bookmark)
      .where(and(eq(bookmark.userId, userId), eq(bookmark.postId, postId)))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return false;
  }
}

export async function incrementImpression(postId: string) {
  try {
    // Increment impressions count
    await db
      .update(post)
      .set({ impressions: sql`${post.impressions} + 1` })
      .where(eq(post.id, postId));

    return { success: true };
  } catch (error) {
    console.error("Error incrementing impression:", error);
    return { success: false };
  }
}
