"use client";

import { useLocale } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Update {
  id: string;
  content: string;
  createdAt: string;
  authorName: string | null;
}

export function ProjectUpdates({ updates }: { updates: Update[] }) {
  const locale = useLocale();

  if (updates.length === 0) return null;

  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div
          key={update.id}
          className="relative border-l-2 border-primary/30 pl-4"
        >
          <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
            <time dateTime={update.createdAt}>
              {new Date(update.createdAt).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {update.authorName && (
              <>
                <span>&middot;</span>
                <span>{update.authorName}</span>
              </>
            )}
          </div>
          <div className="prose prose-sm prose-gray max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {update.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}
