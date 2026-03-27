import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and, arrayContains, sql } from "drizzle-orm";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ProjectFilters } from "@/components/projects/ProjectFilters";

const PAGE_SIZE = 12;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const country = typeof sp.country === "string" ? sp.country : undefined;
  const type = typeof sp.type === "string" ? sp.type : undefined;
  const topic = typeof sp.topic === "string" ? sp.topic : undefined;
  const phase = typeof sp.phase === "string" ? sp.phase : undefined;
  const lang = typeof sp.lang === "string" ? sp.lang : undefined;
  const page = typeof sp.page === "string" ? parseInt(sp.page, 10) || 1 : 1;

  // Build conditions
  const conditions = [eq(projects.status, "approved")];
  if (country) conditions.push(eq(projects.country, country));
  if (type) conditions.push(eq(projects.institutionType, type));
  if (topic) conditions.push(arrayContains(projects.topics, [topic]));
  if (phase) conditions.push(eq(projects.studyPhase, phase));
  if (lang) conditions.push(eq(projects.language, lang));

  const where = conditions.length === 1 ? conditions[0] : and(...conditions);

  const results = await db
    .select()
    .from(projects)
    .where(where)
    .orderBy(projects.approvedAt)
    .limit(PAGE_SIZE + 1)
    .offset((page - 1) * PAGE_SIZE);

  const hasMore = results.length > PAGE_SIZE;
  const pageProjects = hasMore ? results.slice(0, PAGE_SIZE) : results;

  return (
    <div>
      <HeroSection />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <Suspense>
          <ProjectFilters />
        </Suspense>
        <div className="mt-6">
          <ProjectGrid projects={pageProjects} hasMore={hasMore} />
        </div>
        {hasMore && (
          <div className="mt-8 text-center">
            <Link
              href={`/?${new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).filter(([, v]) => typeof v === "string") as [string, string][]), page: String(page + 1) }).toString()}`}
              className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Next Page
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function HeroSection() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");

  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark px-4 py-20 text-center text-white">
      <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
        {t("subtitle")}
      </p>
      <Link
        href="/projects/submit"
        className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-primary shadow-lg transition-transform hover:scale-105"
      >
        {tNav("submit")}
      </Link>
    </section>
  );
}
