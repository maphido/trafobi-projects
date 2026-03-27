import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { AdminReviewQueue } from "@/components/admin/ReviewQueue";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  // Verify admin role from DB (don't trust JWT alone for admin)
  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (user?.role !== "admin") redirect("/");

  const submitted = await db
    .select()
    .from(projects)
    .where(eq(projects.status, "submitted"))
    .orderBy(desc(projects.submittedAt));

  return <AdminReviewQueue projects={submitted} />;
}
