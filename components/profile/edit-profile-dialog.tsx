"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { updateProfile } from "@/app/actions/profile";
import { useRouter } from "next/navigation";

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    id: string;
    name: string;
    image: string | null;
    cover: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
  };
}

export function EditProfileDialog({
  isOpen,
  onClose,
  userData,
}: EditProfileDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(userData.name);
  const [bio, setBio] = useState(userData.bio || "");
  const [location, setLocation] = useState(userData.location || "");
  const [website, setWebsite] = useState(userData.website || "");
  const [imagePreview, setImagePreview] = useState(userData.image);
  const [coverPreview, setCoverPreview] = useState(userData.cover);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("location", location);
      formData.append("website", website);

      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (coverFile) {
        formData.append("cover", coverFile);
      }

      const result = await updateProfile(formData);

      if (!result.success) {
        setError(result.error || "Failed to update profile");
        setLoading(false);
        return;
      }

      router.refresh();
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Edit profile</DialogTitle>
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={loading}
              className="h-9 w-9 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold">Edit profile</h2>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="rounded-full bg-[#1d9bf0] px-6 font-bold hover:bg-[#1a8cd8]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(90vh-3.5rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="relative">
            <div className="relative h-48 bg-muted">
              {coverPreview ? (
                <Image
                  src={coverPreview}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-linear-to-br from-[#1d9bf0]/20 to-muted" />
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-11 w-11 rounded-full bg-black/60 hover:bg-black/80"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={loading}
                >
                  <Camera className="h-5 w-5 text-white" />
                </Button>
                {coverPreview && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-11 w-11 rounded-full bg-black/60 hover:bg-black/80"
                    onClick={() => {
                      setCoverPreview(null);
                      setCoverFile(null);
                    }}
                    disabled={loading}
                  >
                    <X className="h-5 w-5 text-white" />
                  </Button>
                )}
              </div>
            </div>

            <div className="absolute left-4 top-32">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage
                    src={imagePreview || undefined}
                    alt={userData.name}
                  />
                  <AvatarFallback className="text-3xl">
                    {userData.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-11 w-11 rounded-full bg-black/60 hover:bg-black/80"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={loading}
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 space-y-6 px-4 pb-6">
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={50}
                disabled={loading}
                className="h-14 rounded-md border-border bg-background"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                maxLength={160}
                rows={3}
                disabled={loading}
                className="w-full rounded-md border border-border bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d9bf0] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {bio.length}/160
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you based?"
                maxLength={30}
                disabled={loading}
                className="h-14 rounded-md border-border bg-background"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Website
              </label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                maxLength={100}
                disabled={loading}
                className="h-14 rounded-md border-border bg-background"
              />
            </div>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
