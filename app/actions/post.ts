"use server";

import { db } from "@/db/drizzle";
import { post } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

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

    // Create post in database
    const postId = `post-${Date.now()}-${Math.random().toString(36).substring(7)}`;

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
