"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CharacterCount } from "./ProjectForm/CharacterCount";

const MAX_LENGTH = 5000;

export function AddUpdateForm({ projectId }: { projectId: string }) {
  const t = useTranslations("project");
  const router = useRouter();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || content.length > MAX_LENGTH) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post update");
      }

      setContent("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post update");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {error && (
        <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("updatePlaceholder")}
        rows={3}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
          content.length > MAX_LENGTH
            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-primary focus:ring-primary"
        }`}
      />
      <div className="mt-1 flex items-center justify-between">
        <CharacterCount value={content} max={MAX_LENGTH} />
        <button
          type="submit"
          disabled={submitting || !content.trim() || content.length > MAX_LENGTH}
          className="rounded-lg bg-gradient-to-r from-primary to-primary-dark px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "..." : t("addUpdate")}
        </button>
      </div>
    </form>
  );
}
