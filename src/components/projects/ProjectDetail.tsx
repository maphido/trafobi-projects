"use client";

import { useLocale, useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Project } from "@/lib/db/schema";
import { TOPIC_LABELS, COUNTRY_FLAGS } from "@/lib/constants";
import { Link } from "@/i18n/navigation";
import { ProjectUpdates } from "./ProjectUpdates";
import { AddUpdateForm } from "./AddUpdateForm";

interface UpdateItem {
  id: string;
  content: string;
  createdAt: string;
  authorName: string | null;
}

interface AuthorProfile {
  fullName: string;
  institution: string | null;
  bio: string | null;
  experience: string | null;
  expertise: string[] | null;
  availableAsExpert: boolean;
}

interface Props {
  project: Project;
  authorName: string;
  authorInstitution?: string;
  authorProfile?: AuthorProfile;
  updates?: UpdateItem[];
  isAuthor?: boolean;
}

export function ProjectDetail({
  project,
  authorName,
  authorInstitution,
  authorProfile,
  updates = [],
  isAuthor = false,
}: Props) {
  const locale = useLocale() as "de" | "en";
  const t = useTranslations("project");
  const tTypes = useTranslations("institutionTypes");
  const tPhases = useTranslations("studyPhases");
  const tProjectPhases = useTranslations("projectPhases");

  const flag = COUNTRY_FLAGS[project.country || ""] || "";
  const links = (project.links || []) as { url: string; label: string }[];

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="mb-4 inline-block text-sm text-gray-500 hover:text-primary"
      >
        &larr; {locale === "de" ? "Alle Projekte" : "All Projects"}
      </Link>

      {project.thumbnailUrl && (
        <div className="mb-6 overflow-hidden rounded-lg">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold leading-tight">{project.title}</h1>

      {/* Meta info */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span>
          {t("by")} {authorName}
          {authorInstitution && ` (${authorInstitution})`}
        </span>
        {project.isResearch && (
          <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
            {t("researchProject")}
          </span>
        )}
        {project.projectPhase && (
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${
            { planning: "bg-amber-100 text-amber-700", development: "bg-blue-100 text-blue-700", active: "bg-green-100 text-green-700", completed: "bg-gray-100 text-gray-600" }[project.projectPhase] || "bg-gray-100 text-gray-600"
          }`}>
            {tProjectPhases(project.projectPhase as "planning")}
          </span>
        )}
        {project.institutionName && (
          <span>
            {flag} {project.institutionName}
            {project.address && `, ${project.address}`}
            {project.city && `, ${project.city}`}
          </span>
        )}
        {project.institutionType && (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">
            {tTypes(project.institutionType as "university")}
          </span>
        )}
        {project.studyPhase && project.studyPhase !== "all" && (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">
            {tPhases(project.studyPhase as "bachelor")}
          </span>
        )}
      </div>

      {/* Topics */}
      {project.topics && project.topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {TOPIC_LABELS[topic]?.[locale] || topic}
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      {project.summary && (
        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          {project.summary}
        </p>
      )}

      {/* Description (Markdown) */}
      {project.description && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">{t("description")}</h2>
          <div className="prose prose-gray max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.description}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Impact */}
      {project.impact && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">{t("impact")}</h2>
          <div className="prose prose-gray max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.impact}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Challenges */}
      {project.challenges && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">{t("challenges")}</h2>
          <div className="prose prose-gray max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.challenges}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Tips */}
      {project.tips && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">{t("tips")}</h2>
          <div className="prose prose-gray max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.tips}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Links */}
      {links.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">{t("links")}</h2>
          <ul className="space-y-2">
            {links.map((link, i) => (
              <li key={i}>
                <a
                  href={/^https?:\/\//i.test(link.url) ? link.url : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {link.label || link.url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* About the Author */}
      {authorProfile && (authorProfile.bio || authorProfile.experience || (authorProfile.expertise && authorProfile.expertise.length > 0)) && (
        <section className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="mb-4 text-xl font-semibold">{t("aboutAuthor")}</h2>
          <div className="space-y-3">
            {authorProfile.availableAsExpert && (
              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                {t("availableAsExpert")}
              </span>
            )}
            {authorProfile.bio && (
              <p className="text-sm text-gray-600">{authorProfile.bio}</p>
            )}
            {authorProfile.experience && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">{t("authorExperience")}</h3>
                <p className="mt-1 text-sm text-gray-600">{authorProfile.experience}</p>
              </div>
            )}
            {authorProfile.expertise && authorProfile.expertise.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">{t("authorExpertise")}</h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {authorProfile.expertise.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Project Updates */}
      {(updates.length > 0 || isAuthor) && (
        <section className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="mb-4 text-xl font-semibold">{t("updates")}</h2>
          {isAuthor && <AddUpdateForm projectId={project.id} />}
          <ProjectUpdates updates={updates} />
        </section>
      )}
    </article>
  );
}
