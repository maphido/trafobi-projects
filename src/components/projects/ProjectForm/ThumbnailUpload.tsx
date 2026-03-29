"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";

interface Props {
  projectId: string | null;
  thumbnailUrl: string;
  onUploaded: (url: string) => void;
  onRemoved: () => void;
}

export function ThumbnailUpload({ projectId, thumbnailUrl, onUploaded, onRemoved }: Props) {
  const t = useTranslations("submit");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/projects/${projectId}/thumbnail`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { thumbnailUrl: url } = await res.json();
      onUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (!projectId) return;
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/thumbnail`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove");
      onRemoved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove");
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {t("thumbnailLabel")}
      </label>
      <p className="mb-2 text-xs text-gray-500">{t("thumbnailHint")}</p>

      {thumbnailUrl ? (
        <div className="relative inline-block">
          <img
            src={thumbnailUrl}
            alt="Thumbnail"
            className="h-32 w-auto rounded-lg border border-gray-200 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow hover:bg-red-600"
          >
            &times;
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading || !projectId}
            className="hidden"
            id="thumbnail-input"
          />
          <label
            htmlFor="thumbnail-input"
            className={`inline-flex cursor-pointer items-center rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition-colors hover:bg-gray-50 ${
              !projectId ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {uploading ? "..." : t("thumbnailUpload")}
          </label>
          {!projectId && (
            <p className="mt-1 text-xs text-amber-600">{t("thumbnailSaveFirst")}</p>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
