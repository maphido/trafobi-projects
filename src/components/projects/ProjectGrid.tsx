"use client";

import { useTranslations } from "next-intl";
import type { Project } from "@/lib/db/schema";
import { ProjectCard } from "./ProjectCard";

interface Props {
  projects: Project[];
  hasMore: boolean;
  onLoadMore?: () => void;
}

export function ProjectGrid({ projects, hasMore, onLoadMore }: Props) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center text-gray-400">
        <p className="text-lg">{tCommon("noResults")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {hasMore && onLoadMore && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            {t("loadMore")}
          </button>
        </div>
      )}
    </div>
  );
}
