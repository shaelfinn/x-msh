import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  read: boolean;
  createdAt: Date;
  postId: string | null;
  sender: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
  post: {
    id: string;
    content: string;
  } | null;
}

interface NotificationsListProps {
  notifications: Notification[];
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

function getNotificationIcon(type: string) {
  switch (type) {
    case "like":
      return <Heart className="h-8 w-8 fill-pink-600 text-pink-600" />;
    case "reply":
      return <MessageCircle className="h-8 w-8 text-[#1d9bf0]" />;
    case "follow":
      return <UserPlus className="h-8 w-8 text-[#1d9bf0]" />;
    default:
      return <Heart className="h-8 w-8 text-muted-foreground" />;
  }
}

function getNotificationText(type: string, senderName: string) {
  switch (type) {
    case "like":
      return `${senderName} liked your post`;
    case "reply":
      return `${senderName} replied to your post`;
    case "follow":
      return `${senderName} followed you`;
    case "mention":
      return `${senderName} mentioned you`;
    default:
      return `${senderName} interacted with you`;
  }
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No notifications yet</p>
      </div>
    );
  }

  return (
    <div>
      {notifications.map((notif) => {
        const href =
          notif.type === "follow"
            ? `/${notif.sender.username}`
            : notif.postId
              ? `/${notif.sender.username}/post/${notif.postId}`
              : "#";

        return (
          <Link
            key={notif.id}
            href={href}
            className={`block border-b border-border p-4 transition-colors hover:bg-muted/30 ${
              !notif.read ? "bg-[#1d9bf0]/5" : ""
            }`}
          >
            <div className="flex gap-3">
              <div className="shrink-0">{getNotificationIcon(notif.type)}</div>
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={notif.sender.image || undefined}
                      alt={notif.sender.name}
                    />
                    <AvatarFallback>
                      {notif.sender.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-bold">{notif.sender.name}</span>{" "}
                      <span className="text-muted-foreground">
                        {getNotificationText(notif.type, "").replace(
                          notif.sender.name,
                          "",
                        )}
                      </span>
                    </p>
                    {notif.post && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {notif.post.content}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatTimeAgo(new Date(notif.createdAt))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
