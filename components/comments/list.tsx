import { CommentComposer } from "./composer";
import { CommentItem } from "./item";

interface Comment {
  id: number;
  author: string;
  username: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  likesCount: number;
  impressionsCount: number;
}

interface CommentsListProps {
  postId: number;
  comments: Comment[];
}

export function CommentsList({ comments }: CommentsListProps) {
  return (
    <div className="border-t border-border">
      <CommentComposer />
      <div>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            author={comment.author}
            username={comment.username}
            avatarUrl={comment.avatarUrl}
            content={comment.content}
            createdAt={comment.createdAt}
            likesCount={comment.likesCount}
            impressionsCount={comment.impressionsCount}
          />
        ))}
      </div>
    </div>
  );
}
