import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { projectCreateSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = projectCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const [project] = await db
    .insert(projects)
    .values({
      authorId: session.user.id,
      title: data.title,
      language: data.language,
      summary: data.summary,
      description: data.description,
      impact: data.impact,
      challenges: data.challenges,
      tips: data.tips,
      institutionName: data.institutionName,
      institutionType: data.institutionType || null,
      country: data.country,
      city: data.city,
      topics: data.topics,
      studyPhase: data.studyPhase,
      links: data.links,
      status: "draft",
    })
    .returning();

  return NextResponse.json(project, { status: 201 });
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.authorId, session.user.id))
    .orderBy(projects.updatedAt);

  return NextResponse.json(userProjects);
}
