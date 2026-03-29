import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateSlug } from "@/lib/utils";
import { projectUpdateSchema } from "@/lib/validation";
import { unlink } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (
    project.status !== "approved" &&
    project.authorId !== session?.user?.id &&
    session?.user?.role !== "admin"
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.authorId, session.user.id)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!["draft", "rejected", "approved", "submitted"].includes(existing.status)) {
    return NextResponse.json(
      { error: "This project cannot be edited in its current status" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = projectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const isSubmitting = data._action === "submit";
  const wasApproved = existing.status === "approved";
  // Editing an approved project always sends it back for re-review
  const newStatus = (isSubmitting || wasApproved) ? "submitted" : existing.status;

  let slug = existing.slug;
  if (isSubmitting && !slug) {
    const baseSlug = generateSlug(data.title || existing.title);
    const [conflict] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.slug, baseSlug))
      .limit(1);
    slug = conflict
      ? `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`
      : baseSlug;
  }

  const [updated] = await db
    .update(projects)
    .set({
      title: data.title ?? existing.title,
      language: data.language ?? existing.language,
      summary: data.summary ?? existing.summary,
      description: data.description ?? existing.description,
      impact: data.impact ?? existing.impact,
      challenges: data.challenges ?? existing.challenges,
      tips: data.tips ?? existing.tips,
      institutionName: data.institutionName ?? existing.institutionName,
      institutionType: data.institutionType ?? existing.institutionType,
      country: data.country ?? existing.country,
      city: data.city ?? existing.city,
      address: data.address ?? existing.address,
      topics: data.topics ?? existing.topics,
      studyPhase: data.studyPhase ?? existing.studyPhase,
      projectPhase: data.projectPhase ?? existing.projectPhase,
      links: data.links ?? existing.links,
      status: newStatus,
      slug,
      updatedAt: new Date(),
      ...((isSubmitting || wasApproved) ? { submittedAt: new Date(), adminFeedback: null } : {}),
    })
    .where(eq(projects.id, id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.authorId, session.user.id)))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete thumbnail file if it exists
  if (project.thumbnailUrl) {
    const filePath = join(process.cwd(), project.thumbnailUrl.replace(/^\//, ""));
    try { await unlink(filePath); } catch { /* file may be gone */ }
  }

  // Cascade deletes handle project_updates and project_media
  await db.delete(projects).where(eq(projects.id, id));

  return NextResponse.json({ ok: true });
}
