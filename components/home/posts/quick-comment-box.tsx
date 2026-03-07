"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createComment } from "@/app/actions/post";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickCommentBoxProps {
  postId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function QuickCommentBox({
  postId,
  onSuccess,
  onCancel,
}: QuickCommentBoxProps) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim() || loading) return;

    setLoading(true);
    const result = await createComment(postId, comment);

    if (result.success) {
      setComment("");
      router.refresh();
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        placeholder="Write your comment..."
        className="w-full resize-none bg-muted/30 rounded-lg p-3 text-[14px] outline-none focus:ring-2 focus:ring-[#1d9bf0] placeholder:text-muted-foreground"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={loading}
        maxLength={1000}
      />
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground">
          {comment.length}/1000
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={loading}
            className="h-8 rounded-full px-4 text-[13px]"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!comment.trim() || loading}
            className="h-8 rounded-full px-4 text-[13px] font-bold bg-[#1d9bf0] text-white hover:bg-[#1a8cd8]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Posting...
              </>
            ) : (
              "Comment"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
