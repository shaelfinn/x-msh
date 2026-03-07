"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, Camera } from "lucide-react";
import { useState, useRef } from "react";
import { createPost } from "@/app/actions/post";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserAvatar } from "@/components/ui/user-avatar";

interface ComposerProps {
  user: {
    name: string;
    image: string | null;
  };
}

const MAX_CHARS = 1000;
const MAX_TOTAL_SIZE = 4.5 * 1024 * 1024;

type PostType = "info" | "offer" | "hire" | "collab";

const POST_TYPES = [
  { value: "info", label: "Discussion", color: "bg-[#1d9bf0]" },
  { value: "offer", label: "Offering", color: "bg-green-500" },
  { value: "hire", label: "Hiring", color: "bg-blue-500" },
  { value: "collab", label: "Collaboration", color: "bg-purple-500" },
] as const;

export function Composer({ user }: ComposerProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<PostType>("info");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<(File | null)[]>([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const charCount = content.length;
  const remaining = MAX_CHARS - charCount;
  const totalFileSize = images
    .filter((img): img is File => img !== null)
    .reduce((sum, file) => sum + file.size, 0);
  const isFileSizeValid = totalFileSize <= MAX_TOTAL_SIZE;
  const isPriceRequired = postType === "offer" || postType === "hire";
  const isPriceValid = !isPriceRequired || (price && parseInt(price) > 0);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...images];
      const newPreviews = [...imagePreviews];
      newImages[index] = file;
      newPreviews[index] = reader.result as string;
      setImages(newImages);
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
    setError("");
    if (e.target) e.target.value = "";
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages[index] = null;
    newPreviews[index] = null;
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (!content.trim() || remaining < 0 || !isFileSizeValid || !isPriceValid)
      return;

    setLoading(true);
    setError("");

    try {
      const mediaUrls: string[] = [];
      const validImages = images.filter((img): img is File => img !== null);

      if (validImages.length > 0) {
        for (const image of validImages) {
          const response = await fetch(
            `/api/upload?filename=${encodeURIComponent(image.name)}`,
            { method: "POST", body: image },
          );
          if (!response.ok) throw new Error("Failed to upload image");
          const { url } = await response.json();
          mediaUrls.push(url);
        }
      }

      const formData = new FormData();
      formData.append("content", content);
      formData.append("type", postType);
      if (price && postType !== "info") {
        formData.append("price", price);
      }
      mediaUrls.forEach((url) => formData.append("mediaUrls", url));

      const result = await createPost(formData);

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Failed to create post");
      }
    } catch {
      setError("Failed to upload images. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <UserAvatar src={user.image} name={user.name} className="h-12 w-12" />
          <div className="flex-1">
            <div className="text-[16px] font-semibold">{user.name}</div>
            <div className="text-[14px] text-muted-foreground">
              Create a new post
            </div>
          </div>
        </div>

        {/* Post Type Selection */}
        <div className="mb-6">
          <label className="block text-[14px] font-medium mb-3">
            Post Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {POST_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setPostType(type.value as PostType)}
                className={`p-4 rounded-xl border-2 text-[15px] font-medium transition-all ${
                  postType === type.value
                    ? `${type.color} text-white border-transparent`
                    : "bg-muted/50 text-foreground border-transparent hover:border-border"
                }`}
                disabled={loading}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-[14px] font-medium mb-3">Content</label>
          <textarea
            placeholder="Share your thoughts, ideas, or opportunities..."
            className="w-full resize-none bg-muted/50 rounded-xl p-4 text-[15px] leading-relaxed outline-none focus:ring-1 focus:ring-[#1d9bf0]/50 placeholder:text-muted-foreground border border-transparent"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_CHARS + 20}
            disabled={loading}
          />
          <div className="flex justify-between items-center mt-2 px-1">
            <div className="text-[13px] text-muted-foreground">
              {charCount > 0 && (
                <>
                  {charCount} / {MAX_CHARS}
                </>
              )}
            </div>
            {remaining < 0 && (
              <div className="text-[13px] text-red-400 font-medium">
                {Math.abs(remaining)} over limit
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        {postType !== "info" && (
          <div className="mb-6">
            <label className="block text-[14px] font-medium mb-3">
              Price {isPriceRequired && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                placeholder={postType === "collab" ? "Optional" : "Required"}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-12 pl-8 text-[15px] bg-muted/50 border-transparent focus:ring-2 focus:ring-[#1d9bf0]"
                disabled={loading}
                min="0"
              />
            </div>
            {postType === "collab" && !price && (
              <p className="mt-2 text-[13px] text-muted-foreground px-1">
                Leave empty to show as free collaboration
              </p>
            )}
            {isPriceRequired && !isPriceValid && (
              <p className="mt-2 text-[13px] text-red-400 px-1">
                Price is required for {postType} posts
              </p>
            )}
          </div>
        )}

        {/* Images */}
        <div className="mb-6">
          <label className="block text-[14px] font-medium mb-3">
            Images (Optional)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="aspect-square">
                <input
                  ref={fileInputRefs[index]}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, index)}
                  className="hidden"
                  disabled={loading}
                />
                {imagePreviews[index] ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-border group">
                    <Image
                      src={imagePreviews[index]!}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      disabled={loading}
                    >
                      <div className="bg-white rounded-full p-2">
                        <X className="h-5 w-5 text-black" />
                      </div>
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] px-2 py-1 rounded">
                      {formatFileSize(images[index]?.size || 0)}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRefs[index].current?.click()}
                    className="w-full h-full rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 hover:bg-muted/40 hover:border-muted-foreground/50 transition-all flex flex-col items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <Camera className="h-8 w-8 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground font-medium">
                      Add Photo
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
          {!isFileSizeValid && (
            <p className="mt-2 text-[13px] text-red-400 px-1">
              Total size {formatFileSize(totalFileSize)} exceeds 4.5MB limit
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[14px] text-red-400">
            {error}
          </div>
        )}

        {/* Post Button */}
        <Button
          onClick={handleSubmit}
          disabled={
            charCount === 0 ||
            remaining < 0 ||
            loading ||
            !isFileSizeValid ||
            !isPriceValid
          }
          className="w-full h-14 rounded-full bg-[#1d9bf0] text-[16px] font-bold text-white hover:bg-[#1a8cd8] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish Post"
          )}
        </Button>
      </div>
    </div>
  );
}
