import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { DashboardContent } from "@/components/projects/DashboardContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.authorId, session.user.id))
    .orderBy(projects.updatedAt);

  return <DashboardContent projects={userProjects} />;
}
