import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { EditProjectForm } from "@/components/projects/EditProjectForm";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(
      and(eq(projects.id, id), eq(projects.authorId, session.user.id))
    )
    .limit(1);

  if (!project || !["draft", "rejected", "approved"].includes(project.status)) {
    redirect("/dashboard");
  }

  return <EditProjectForm project={project} />;
}
