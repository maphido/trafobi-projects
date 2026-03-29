import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "uploads", "thumbnails");
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [project] = await db
    .select({ id: projects.id, authorId: projects.authorId, thumbnailUrl: projects.thumbnailUrl })
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.authorId, session.user.id)))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, and WebP images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 5 MB)" },
      { status: 400 }
    );
  }

  // Delete old thumbnail if it exists
  if (project.thumbnailUrl) {
    const oldPath = join(process.cwd(), project.thumbnailUrl.replace(/^\//, ""));
    try {
      await unlink(oldPath);
    } catch {
      // File may already be gone
    }
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${id}-${Date.now()}.${ext}`;
  const filepath = join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  const thumbnailUrl = `/uploads/thumbnails/${filename}`;

  await db
    .update(projects)
    .set({ thumbnailUrl, updatedAt: new Date() })
    .where(eq(projects.id, id));

  return NextResponse.json({ thumbnailUrl }, { status: 200 });
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
    .select({ id: projects.id, authorId: projects.authorId, thumbnailUrl: projects.thumbnailUrl })
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.authorId, session.user.id)))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (project.thumbnailUrl) {
    const oldPath = join(process.cwd(), project.thumbnailUrl.replace(/^\//, ""));
    try {
      await unlink(oldPath);
    } catch {
      // File may already be gone
    }

    await db
      .update(projects)
      .set({ thumbnailUrl: null, updatedAt: new Date() })
      .where(eq(projects.id, id));
  }

  return NextResponse.json({ ok: true });
}
