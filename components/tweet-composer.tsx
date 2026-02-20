import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image, Smile, Calendar, MapPin, Settings2 } from "lucide-react";

export function TweetComposer() {
  return (
    <div className="border-b border-border p-4">
      <div className="flex gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/avatar.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            placeholder="What is happening?!"
            className="w-full resize-none bg-transparent text-xl outline-none placeholder:text-muted-foreground"
            rows={3}
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
              >
                <Image className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
              >
                <Smile className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
              >
                <Calendar className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
              >
                <MapPin className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
              >
                <Settings2 className="h-5 w-5" />
              </Button>
            </div>
            <Button className="rounded-full bg-[#1d9bf0] px-4 font-bold text-white hover:bg-[#1a8cd8]">
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
