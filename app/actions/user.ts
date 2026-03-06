"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function detectCountry(): Promise<string | null> {
  try {
    const headersList = await headers();
    // Vercel provides geo headers
    const country = headersList.get("x-vercel-ip-country");
    return country || null;
  } catch {
    return null;
  }
}

export async function setupUserProfile(data: {
  username: string;
  country?: string;
}) {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "Unauthorized" };
    }

    const { username: newUsername, country } = data;

    if (!newUsername || typeof newUsername !== "string") {
      return { error: "Username is required" };
    }

    // Validate username format
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(newUsername)) {
      return {
        error:
          "Username must be 3-20 characters (lowercase letters, numbers, underscore)",
      };
    }

    // Check if username is already taken
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.username, newUsername))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].id !== session.user.id) {
      return { error: "Username is already taken" };
    }

    // Update user - only set country if provided
    const updateData: {
      username: string;
      country?: string;
      updatedAt: Date;
    } = {
      username: newUsername,
      updatedAt: new Date(),
    };

    if (country) {
      updateData.country = country;
    }

    await db.update(user).set(updateData).where(eq(user.id, session.user.id));

    // Revalidate to update session
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Setup error:", error);
    return { error: "Internal server error" };
  }
}
