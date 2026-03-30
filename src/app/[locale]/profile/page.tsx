import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "@/components/profile/ProfileForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      institution: users.institution,
      country: users.country,
      bio: users.bio,
      experience: users.experience,
      expertise: users.expertise,
      availableAsExpert: users.availableAsExpert,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) {
    redirect("/auth/login");
  }

  return <ProfileForm user={user} />;
}
