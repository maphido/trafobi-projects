import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, projectUpdates, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { projectUpdateContentSchema } from "@/lib/validation";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Verify project exists and is approved
  const [project] = await db
    .select({ id: projects.id, status: projects.status })
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  if (!project || project.status !== "approved") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updates = await db
    .select({
      id: projectUpdates.id,
      content: projectUpdates.content,
      createdAt: projectUpdates.createdAt,
      authorName: users.fullName,
    })
    .from(projectUpdates)
    .leftJoin(users, eq(projectUpdates.authorId, users.id))
    .where(eq(projectUpdates.projectId, id))
    .orderBy(desc(projectUpdates.createdAt));

  return NextResponse.json(updates);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify project exists, is approved, and user is the author
  const [project] = await db
    .select({
      id: projects.id,
      status: projects.status,
      authorId: projects.authorId,
    })
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (project.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (project.status !== "approved") {
    return NextResponse.json(
      { error: "Updates can only be added to approved projects" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const parsed = projectUpdateContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const [update] = await db
    .insert(projectUpdates)
    .values({
      projectId: id,
      authorId: session.user.id,
      content: parsed.data.content,
    })
    .returning();

  return NextResponse.json(update, { status: 201 });
}
