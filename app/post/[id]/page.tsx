import { Sidebar } from "@/components/shared/sidebar";
import { Trending } from "@/components/home/trending";
import { MobileNav } from "@/components/shared/mobile-nav";
import { CommentsSection } from "@/components/home/comments-section";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MessageCircle,
  Heart,
  Bookmark,
  BarChart2,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock data - in production, fetch based on params.id
const post = {
  id: 1,
  author: "Sarah Chen",
  username: "sarahdev",
  createdAt: "Feb 20, 2026 · 22:45",
  content:
    "Just shipped a new feature using Next.js 15 and the performance improvements are incredible! 🚀\n\nThe new caching strategies make everything so much faster.",
  avatarUrl: "/avatar.jpg",
  imageUrl: "/1.jpg",
  commentsCount: 24,
  likesCount: 892,
  bookmarksCount: 156,
  impressionsCount: 12500,
};

const comments = [
  {
    id: 1,
    author: "Alex Rivera",
    username: "alexcodes",
    avatarUrl: "/avatar.jpg",
    content:
      "This is amazing! Can you share more details about the caching strategies you used?",
    createdAt: "1h",
    likesCount: 12,
    impressionsCount: 450,
  },
  {
    id: 2,
    author: "Maya Patel",
    username: "mayabuilds",
    avatarUrl: "/avatar.jpg",
    content: "Congrats on the launch! 🎉 Next.js 15 is a game changer.",
    createdAt: "45m",
    likesCount: 8,
    impressionsCount: 320,
  },
  {
    id: 3,
    author: "Jordan Lee",
    username: "jordantech",
    avatarUrl: "/avatar.jpg",
    content:
      "I've been testing Next.js 15 too and the performance gains are real. Great work!",
    createdAt: "30m",
    likesCount: 5,
    impressionsCount: 280,
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export default function PostPage() {
  return (
    <>
      <div className="flex min-h-screen pb-16 lg:pb-0">
        <Sidebar />

        <main className="flex-1 border-r border-border">
          <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="flex h-14 items-center gap-8 px-4">
              <Link href="/" className="rounded-full p-2 hover:bg-muted">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold">Post</h1>
            </div>
          </div>

          {/* Post Detail */}
          <div className="border-b border-border p-4">
            <div className="flex gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.avatarUrl} alt={post.author} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold hover:underline">{post.author}</p>
                    <p className="text-muted-foreground">@{post.username}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xl leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
              {post.imageUrl && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                  <Image
                    src={post.imageUrl}
                    alt="Post image"
                    width={600}
                    height={400}
                    className="w-full object-cover"
                  />
                </div>
              )}
              <p className="mt-4 text-muted-foreground">{post.createdAt}</p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-around border-y border-border py-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">
                  {formatNumber(post.commentsCount)}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-pink-600"
              >
                <Heart className="h-5 w-5" />
                <span className="text-sm">{formatNumber(post.likesCount)}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
              >
                <BarChart2 className="h-5 w-5" />
                <span className="text-sm">
                  {formatNumber(post.impressionsCount)}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
              >
                <Bookmark className="h-5 w-5" />
                <span className="text-sm">
                  {formatNumber(post.bookmarksCount)}
                </span>
              </Button>
            </div>
          </div>

          <CommentsSection postId={post.id} comments={comments} />
        </main>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
