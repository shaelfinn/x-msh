"use client";

import { useEffect, useRef } from "react";
import { incrementImpression } from "@/app/actions/post";

interface ImpressionTrackerProps {
  postId: string;
}

export function ImpressionTracker({ postId }: ImpressionTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;

    // Check if impression already tracked in cookie
    const cookieName = `impression_${postId}`;
    const hasViewed = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cookieName}=`));

    if (!hasViewed) {
      // Track impression
      incrementImpression(postId);

      // Set cookie to expire in 30 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `${cookieName}=1; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

      hasTracked.current = true;
    }
  }, [postId]);

  return null;
}
