import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Generate a consistent color based on a string (name or ID)
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate HSL color with good saturation and lightness for readability
  const hue = Math.abs(hash % 360);
  const saturation = 65 + (Math.abs(hash) % 10); // 65-75%
  const lightness = 45 + (Math.abs(hash) % 10); // 45-55%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Get initials from name
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

interface UserAvatarProps {
  src?: string | null;
  name: string;
  className?: string;
}

export function UserAvatar({ src, name, className }: UserAvatarProps) {
  const backgroundColor = stringToColor(name);
  const initials = getInitials(name);

  return (
    <Avatar className={className}>
      <AvatarImage src={src || undefined} alt={name} />
      <AvatarFallback
        style={{ backgroundColor }}
        className="text-white font-semibold"
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
