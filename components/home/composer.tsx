"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Smile,
  Calendar,
  MapPin,
  Settings2,
  ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { useState, useRef } from "react";
import { createPost } from "@/app/actions/post";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ComposerProps {
  user: {
    name: string;
    image: string | null;
  };
}

const MAX_CHARS = 280;
const MAX_IMAGES = 3;
const MAX_TOTAL_SIZE = 4.5 * 1024 * 1024; // 4.5MB total (Vercel serverless limit)

export function Composer({ user }: ComposerProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = content.length;
  const remaining = MAX_CHARS - charCount;
  const percentage = (charCount / MAX_CHARS) * 100;
  const isActive = isFocused || content.length > 0 || images.length > 0;

  // Calculate total file size
  const totalFileSize = images.reduce((sum, file) => sum + file.size, 0);
  const isFileSizeValid = totalFileSize <= MAX_TOTAL_SIZE;

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const getCircleColor = () => {
    if (remaining < 0) return "#f4212e";
    if (remaining <= 20) return "#ffd400";
    return "#1d9bf0";
  };

  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = MAX_IMAGES - images.length;

    if (files.length > remainingSlots) {
      return; // Silently ignore extra files
    }

    // Read all files and wait for all previews to be ready
    const previewPromises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    const newPreviews = await Promise.all(previewPromises);

    // Update both states together to keep them in sync
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    setError("");

    // Reset input so same file can be selected again
    if (e.target) {
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() || remaining < 0 || !isFileSizeValid) return;

    setLoading(true);
    setError("");

    try {
      const mediaUrls: string[] = [];

      // Upload images directly from client to Vercel Blob
      if (images.length > 0) {
        for (const image of images) {
          const response = await fetch(
            `/api/upload?filename=${encodeURIComponent(image.name)}`,
            {
              method: "POST",
              body: image,
            },
          );

          if (!response.ok) {
            throw new Error("Failed to upload image");
          }

          const { url } = await response.json();
          mediaUrls.push(url);
        }
      }

      // Create post with uploaded image URLs
      const formData = new FormData();
      formData.append("content", content);
      mediaUrls.forEach((url) => {
        formData.append("mediaUrls", url);
      });

      const result = await createPost(formData);

      if (result.success) {
        setContent("");
        setImages([]);
        setImagePreviews([]);
        setIsFocused(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to create post");
      }
    } catch {
      setError("Failed to upload images. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="border-b border-border p-4">
      <div className="flex gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image || undefined} alt={user.name} />
          <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            placeholder="What is happening?!"
            className="w-full resize-none bg-transparent text-xl outline-none placeholder:text-muted-foreground"
            rows={isActive ? 3 : 1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            maxLength={MAX_CHARS + 20}
            disabled={loading}
          />

          {isActive && (
            <>
              {imagePreviews.length > 0 && (
                <div
                  className={`mt-3 grid gap-2 ${
                    imagePreviews.length === 1
                      ? "grid-cols-1"
                      : imagePreviews.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-2"
                  }`}
                >
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className={`relative overflow-hidden rounded-2xl border border-border ${
                        imagePreviews.length === 3 && index === 0
                          ? "col-span-2"
                          : ""
                      }`}
                    >
                      <Image
                        src={preview}
                        alt={`Upload ${index + 1}`}
                        width={600}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                        {formatFileSize(images[index]?.size || 0)}
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length > 0 && !isFileSizeValid && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Total size {formatFileSize(totalFileSize)} exceeds 4.5MB limit
                </div>
              )}

              {error && (
                <div className="mt-2 text-sm text-destructive">{error}</div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={loading || images.length >= MAX_IMAGES}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading || images.length >= MAX_IMAGES}
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                    disabled={loading}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                    disabled={loading}
                  >
                    <Calendar className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                    disabled={loading}
                  >
                    <MapPin className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                    disabled={loading}
                  >
                    <Settings2 className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  {charCount > 0 && (
                    <div className="relative flex items-center justify-center">
                      <svg className="h-8 w-8 -rotate-90 transform">
                        <circle
                          cx="16"
                          cy="16"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-muted-foreground/20"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r={radius}
                          stroke={getCircleColor()}
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-150"
                        />
                      </svg>
                      {remaining <= 20 && (
                        <span
                          className="absolute text-xs font-medium"
                          style={{ color: getCircleColor() }}
                        >
                          {remaining}
                        </span>
                      )}
                    </div>
                  )}
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      charCount === 0 ||
                      remaining < 0 ||
                      loading ||
                      !isFileSizeValid
                    }
                    className="rounded-full bg-[#1d9bf0] px-4 font-bold text-white hover:bg-[#1a8cd8] disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
