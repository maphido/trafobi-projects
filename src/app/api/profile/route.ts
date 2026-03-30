import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { profileUpdateSchema } from "@/lib/validation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const [updated] = await db
    .update(users)
    .set({
      fullName: data.fullName,
      institution: data.institution || null,
      country: data.country || null,
      bio: data.bio || null,
      experience: data.experience || null,
      expertise: data.expertise,
      availableAsExpert: data.availableAsExpert,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id))
    .returning({
      id: users.id,
      fullName: users.fullName,
      institution: users.institution,
      country: users.country,
      bio: users.bio,
      experience: users.experience,
      expertise: users.expertise,
      availableAsExpert: users.availableAsExpert,
    });

  return NextResponse.json(updated);
}
