import { CommentComposer } from "./composer";
import { CommentItem } from "./item";

interface Comment {
  id: string;
  content: string;
  media: string[] | null;
  likes: number;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
}

interface CommentsListProps {
  postId: string;
  comments: Comment[];
  user?: {
    name: string;
    image: string | null;
  };
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function CommentsList({ postId, comments, user }: CommentsListProps) {
  return (
    <div className="border-t border-border">
      <CommentComposer postId={postId} user={user} />
      <div>
        {comments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              author={comment.author.name}
              username={comment.author.username || ""}
              avatarUrl={comment.author.image}
              content={comment.content}
              createdAt={formatTimeAgo(new Date(comment.createdAt))}
              likesCount={comment.likes}
              impressionsCount={0}
            />
          ))
        )}
      </div>
    </div>
  );
}
