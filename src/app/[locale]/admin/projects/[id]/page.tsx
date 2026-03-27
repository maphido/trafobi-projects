import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AdminReviewPanel } from "@/components/admin/ReviewPanel";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function AdminReviewPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (user?.role !== "admin") redirect("/");

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  if (!project) notFound();

  // Get author info
  const [author] = await db
    .select({ fullName: users.fullName, email: users.email })
    .from(users)
    .where(eq(users.id, project.authorId))
    .limit(1);

  return (
    <AdminReviewPanel
      project={project}
      authorName={author?.fullName || "Unknown"}
      authorEmail={author?.email || ""}
    />
  );
}
