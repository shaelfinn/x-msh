import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";

/**
 * Verifies the current session and returns session data
 * Returns null if no valid session exists
 * This is the core DAL (Data Access Layer) function for authentication
 */
export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return {
    isAuth: true,
    userId: session.user.id,
    user: session.user,
    session: session.session,
  };
});

/**
 * Gets the current session
 * Returns null if no session exists
 */
export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});

/**
 * Gets the current user
 * Returns null if not authenticated
 */
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
});

/**
 * Requires authentication - redirects to signin if not authenticated
 * Use this in Server Components and Server Actions that require auth
 */
export const requireAuth = cache(async () => {
  const sessionData = await verifySession();

  if (!sessionData) {
    redirect("/signin");
  }

  return sessionData;
});
