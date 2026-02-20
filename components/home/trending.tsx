import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Trending() {
  const trends = [
    { category: "Technology", topic: "Next.js 15", posts: "45.2K" },
    { category: "Programming", topic: "TypeScript", posts: "128K" },
    { category: "Trending", topic: "AI Development", posts: "89.5K" },
    { category: "Web Dev", topic: "React 19", posts: "234K" },
    { category: "Tech News", topic: "shadcn/ui", posts: "67.8K" },
  ];

  return (
    <div className="sticky top-0 hidden h-screen w-[350px] overflow-y-auto px-6 py-2 xl:block">
      <div className="sticky top-0 bg-background pb-3 pt-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search" className="rounded-full bg-muted pl-12" />
        </div>
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="p-4">
          <h2 className="text-xl font-bold">What&apos;s happening</h2>
        </div>
        {trends.map((trend, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{trend.category}</p>
              <p className="font-bold">{trend.topic}</p>
              <p className="text-sm text-muted-foreground">
                {trend.posts} posts
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
}
