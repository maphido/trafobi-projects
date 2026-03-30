import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, users, projectUpdates } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
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

  // Fetch author info, updates, and session in parallel
  const [author, updates, session] = await Promise.all([
    db
      .select({
        fullName: users.fullName,
        institution: users.institution,
        bio: users.bio,
        experience: users.experience,
        expertise: users.expertise,
        availableAsExpert: users.availableAsExpert,
      })
      .from(users)
      .where(eq(users.id, project.authorId))
      .limit(1)
      .then(([a]) => a),
    db
      .select({
        id: projectUpdates.id,
        content: projectUpdates.content,
        createdAt: projectUpdates.createdAt,
        authorName: users.fullName,
      })
      .from(projectUpdates)
      .leftJoin(users, eq(projectUpdates.authorId, users.id))
      .where(eq(projectUpdates.projectId, project.id))
      .orderBy(desc(projectUpdates.createdAt)),
    auth(),
  ]);

  const isAuthor = session?.user?.id === project.authorId;

  return (
    <ProjectDetail
      project={project}
      authorName={author?.fullName || "Unknown"}
      authorInstitution={author?.institution || undefined}
      authorProfile={author ? {
        fullName: author.fullName,
        institution: author.institution,
        bio: author.bio,
        experience: author.experience,
        expertise: author.expertise,
        availableAsExpert: author.availableAsExpert,
      } : undefined}
      updates={updates.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        authorName: u.authorName,
      }))}
      isAuthor={isAuthor}
    />
  );
}
