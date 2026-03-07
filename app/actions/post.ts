"use server";

import { db } from "@/db/drizzle";
import { post, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, isNull, desc, sql } from "drizzle-orm";

export async function createPost(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const content = formData.get("content") as string;
    const type =
      (formData.get("type") as "info" | "offer" | "hire" | "collab") || "info";
    const priceStr = formData.get("price") as string;
    const mediaUrls = formData.getAll("mediaUrls") as string[];

    if (!content?.trim()) {
      return { success: false, error: "Content is required" };
    }

    if (content.length > 1000) {
      return { success: false, error: "Content exceeds 1000 characters" };
    }

    // Validate price for offer and hire types
    if (
      (type === "offer" || type === "hire") &&
      (!priceStr || parseInt(priceStr) <= 0)
    ) {
      return { success: false, error: `Price is required for ${type} posts` };
    }

    // Create post in database - generate Twitter-style numeric ID
    const postId = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;

    const postData: {
      id: string;
      content: string;
      authorId: string;
      parentId: null;
      type: "info" | "offer" | "hire" | "collab";
      price?: number;
      impressions: number;
      media?: string[];
    } = {
      id: postId,
      content: content.trim(),
      authorId: session.user.id,
      parentId: null,
      type: type,
      impressions: 0,
    };

    // Add price if provided
    if (priceStr && parseInt(priceStr) > 0) {
      postData.price = parseInt(priceStr);
    }

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
    // Get all posts with comment counts
    const posts = await db
      .select({
        id: post.id,
        content: post.content,
        media: post.media,
        type: post.type,
        price: post.price,
        likedBy: post.likedBy,
        bookmarkedBy: post.bookmarkedBy,
        impressions: post.impressions,
        createdAt: post.createdAt,
        commentsCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${post} AS comments 
          WHERE comments.parent_id = ${post.id}
        )`,
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

    // Add isLiked, isBookmarked, and likes count
    return posts.map((p) => {
      const likedBy = (p.likedBy as string[]) || [];
      const bookmarkedBy = (p.bookmarkedBy as string[]) || [];

      return {
        ...p,
        isLiked: userId ? likedBy.includes(userId) : false,
        isBookmarked: userId ? bookmarkedBy.includes(userId) : false,
        likes: likedBy.length, // Real count from array
      };
    });
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
        likedBy: post.likedBy,
        bookmarkedBy: post.bookmarkedBy,
        impressions: post.impressions,
        createdAt: post.createdAt,
        commentsCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${post} AS comments 
          WHERE comments.parent_id = ${post.id}
        )`,
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

    if (!result[0]) return null;

    const p = result[0];
    const likedBy = (p.likedBy as string[]) || [];
    const bookmarkedBy = (p.bookmarkedBy as string[]) || [];

    return {
      ...p,
      isLiked: userId ? likedBy.includes(userId) : false,
      isBookmarked: userId ? bookmarkedBy.includes(userId) : false,
      likes: likedBy.length,
    };
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
        likedBy: post.likedBy,
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

    return comments.map((c) => ({
      ...c,
      likes: ((c.likedBy as string[]) || []).length,
    }));
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

    if (content.length > 1000) {
      return { success: false, error: "Content exceeds 1000 characters" };
    }

    const commentId = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;

    await db.insert(post).values({
      id: commentId,
      content: content.trim(),
      authorId: session.user.id,
      parentId: postId,
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

    const userId = session.user.id;

    // Get current post
    const [currentPost] = await db
      .select({ likedBy: post.likedBy })
      .from(post)
      .where(eq(post.id, postId))
      .limit(1);

    if (!currentPost) {
      return { success: false, error: "Post not found" };
    }

    const likedBy = (currentPost.likedBy as string[]) || [];
    const isLiked = likedBy.includes(userId);

    if (isLiked) {
      // Unlike
      const newLikedBy = likedBy.filter((id) => id !== userId);
      await db
        .update(post)
        .set({ likedBy: newLikedBy })
        .where(eq(post.id, postId));

      revalidatePath("/");
      return { success: true, liked: false };
    } else {
      // Like
      const newLikedBy = [...likedBy, userId];
      await db
        .update(post)
        .set({ likedBy: newLikedBy })
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

    const userId = session.user.id;

    // Get current post
    const [currentPost] = await db
      .select({ bookmarkedBy: post.bookmarkedBy })
      .from(post)
      .where(eq(post.id, postId))
      .limit(1);

    if (!currentPost) {
      return { success: false, error: "Post not found" };
    }

    const bookmarkedBy = (currentPost.bookmarkedBy as string[]) || [];
    const isBookmarked = bookmarkedBy.includes(userId);

    if (isBookmarked) {
      // Remove bookmark
      const newBookmarkedBy = bookmarkedBy.filter((id) => id !== userId);
      await db
        .update(post)
        .set({ bookmarkedBy: newBookmarkedBy })
        .where(eq(post.id, postId));

      revalidatePath("/");
      return { success: true, bookmarked: false };
    } else {
      // Add bookmark
      const newBookmarkedBy = [...bookmarkedBy, userId];
      await db
        .update(post)
        .set({ bookmarkedBy: newBookmarkedBy })
        .where(eq(post.id, postId));

      revalidatePath("/");
      return { success: true, bookmarked: true };
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false, error: "Failed to toggle bookmark" };
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
