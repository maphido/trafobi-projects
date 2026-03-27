"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/db/schema";
import { COUNTRY_FLAGS } from "@/lib/constants";

export function AdminReviewQueue({ projects }: { projects: Project[] }) {
  const t = useTranslations("admin");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <h2 className="mb-4 text-lg font-semibold text-gray-600">
        {t("reviewQueue")} ({projects.length})
      </h2>

      {projects.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center text-gray-400">
          {t("noSubmissions")}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const flag = COUNTRY_FLAGS[project.country || ""] || "";
            return (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    {project.summary && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                        {project.summary}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                      {project.institutionName && (
                        <span>
                          {flag} {project.institutionName}
                        </span>
                      )}
                      {project.submittedAt && (
                        <span>
                          {new Date(project.submittedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    Submitted
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
