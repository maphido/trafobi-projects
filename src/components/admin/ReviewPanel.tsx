"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Project } from "@/lib/db/schema";
import { TOPIC_LABELS, COUNTRY_FLAGS } from "@/lib/constants";

interface Props {
  project: Project;
  authorName: string;
  authorEmail: string;
}

export function AdminReviewPanel({ project, authorName, authorEmail }: Props) {
  const t = useTranslations("admin");
  const tProject = useTranslations("project");
  const tTypes = useTranslations("institutionTypes");
  const locale = useLocale() as "de" | "en";
  const router = useRouter();

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const flag = COUNTRY_FLAGS[project.country || ""] || "";
  const links = (project.links || []) as { url: string; label: string }[];

  async function handleAction(action: "approve" | "reject") {
    if (action === "reject" && !feedback.trim()) {
      setError("Feedback is required for rejection");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        action,
        feedback: feedback.trim() || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        onClick={() => router.push("/admin")}
        className="mb-4 text-sm text-gray-500 hover:text-primary"
      >
        &larr; {t("reviewQueue")}
      </button>

      {/* Project preview */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold">{project.title}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span>{authorName} ({authorEmail})</span>
          {project.institutionName && (
            <span>{flag} {project.institutionName}</span>
          )}
          {project.institutionType && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">
              {tTypes(project.institutionType as "university")}
            </span>
          )}
        </div>

        {project.topics && project.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {project.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {TOPIC_LABELS[topic]?.[locale] || topic}
              </span>
            ))}
          </div>
        )}

        {project.summary && (
          <p className="mt-4 text-gray-600">{project.summary}</p>
        )}

        {project.description && (
          <section className="mt-6">
            <h2 className="mb-2 font-semibold">{tProject("description")}</h2>
            <div className="prose prose-sm prose-gray max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.description}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {project.impact && (
          <section className="mt-6">
            <h2 className="mb-2 font-semibold">{tProject("impact")}</h2>
            <div className="prose prose-sm prose-gray max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.impact}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {project.challenges && (
          <section className="mt-6">
            <h2 className="mb-2 font-semibold">{tProject("challenges")}</h2>
            <div className="prose prose-sm prose-gray max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.challenges}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {project.tips && (
          <section className="mt-6">
            <h2 className="mb-2 font-semibold">{tProject("tips")}</h2>
            <div className="prose prose-sm prose-gray max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.tips}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {links.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-2 font-semibold">{tProject("links")}</h2>
            <ul className="space-y-1">
              {links.map((link, i) => (
                <li key={i}>
                  <a
                    href={/^https?:\/\//i.test(link.url) ? link.url : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {link.label || link.url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Review actions */}
      {project.status === "submitted" && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-semibold">Review</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">
              {t("feedbackLabel")}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t("feedbackPlaceholder")}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleAction("approve")}
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {t("approve")}
            </button>
            <button
              onClick={() => handleAction("reject")}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {t("reject")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
