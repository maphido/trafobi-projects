import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { projects, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  if (!project || project.status !== "approved") {
    return { title: "Not Found" };
  }

  return {
    title: `${project.title} – Transformative Bildung`,
    description: project.summary || undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  if (!project || project.status !== "approved") {
    notFound();
  }

  // Fetch author info
  const [author] = await db
    .select({ fullName: users.fullName, institution: users.institution })
    .from(users)
    .where(eq(users.id, project.authorId))
    .limit(1);

  return (
    <ProjectDetail
      project={project}
      authorName={author?.fullName || "Unknown"}
      authorInstitution={author?.institution || undefined}
    />
  );
}
