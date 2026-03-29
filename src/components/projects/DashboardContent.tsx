"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  submitted: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export function DashboardContent({ projects }: { projects: Project[] }) {
  const t = useTranslations("dashboard");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(projectId: string) {
    if (!confirm(t("deleteConfirm"))) return;
    setDeleting(projectId);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  if (projects.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center text-gray-400">
          <p>{t("empty")}</p>
          <Link
            href="/projects/submit"
            className="mt-4 inline-block rounded-lg bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-semibold text-white"
          >
            {tNav("submit")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link
          href="/projects/submit"
          className="rounded-lg bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-semibold text-white"
        >
          {tNav("submit")}
        </Link>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-semibold">{project.title}</h2>
                {project.summary && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {project.summary}
                  </p>
                )}
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                  STATUS_COLORS[project.status] || STATUS_COLORS.draft
                )}
              >
                {t(`status.${project.status}` as "status.draft")}
              </span>
            </div>

            {project.status === "rejected" && project.adminFeedback && (
              <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <strong>{t("adminFeedback")}:</strong> {project.adminFeedback}
              </div>
            )}

            <div className="mt-3 flex gap-2">
              {(project.status === "draft" ||
                project.status === "rejected") && (
                <Link
                  href={`/dashboard/projects/${project.id}/edit`}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  {project.status === "rejected"
                    ? t("status.draft") // "Edit & Resubmit" — reuse label
                    : "Edit"}
                </Link>
              )}
              {project.status === "approved" && (
                <>
                  {project.slug && (
                    <Link
                      href={`/projects/${project.slug}`}
                      className="rounded-lg border border-green-300 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
                    >
                      View
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/projects/${project.id}/edit`}
                    className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
                    title={t("editApprovedWarning")}
                  >
                    {t("editApproved")}
                  </Link>
                </>
              )}
              <button
                onClick={() => handleDelete(project.id)}
                disabled={deleting === project.id}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
              >
                {deleting === project.id ? "..." : tCommon("delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
