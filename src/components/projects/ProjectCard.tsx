"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/db/schema";
import { TOPIC_LABELS, COUNTRY_FLAGS } from "@/lib/constants";

export function ProjectCard({ project }: { project: Project }) {
  const locale = useLocale() as "de" | "en";
  const t = useTranslations("project");
  const tTypes = useTranslations("institutionTypes");

  const flag = COUNTRY_FLAGS[project.country || ""] || "";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      {/* Thumbnail or gradient placeholder */}
      {project.thumbnailUrl ? (
        <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] rounded-t-lg bg-gradient-to-br from-primary/20 to-primary-dark/20" />
      )}

      <div className="p-4">
        <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary">
          {project.title}
        </h3>

        {project.summary && (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
            {project.summary}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-400">
          {project.institutionName && (
            <span>
              {flag} {project.institutionName}
            </span>
          )}
          {project.institutionType && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-500">
              {tTypes(project.institutionType as "university")}
            </span>
          )}
        </div>

        {project.topics && project.topics.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {project.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {TOPIC_LABELS[topic]?.[locale] || topic}
              </span>
            ))}
            {project.topics.length > 3 && (
              <span className="text-xs text-gray-400">
                +{project.topics.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
