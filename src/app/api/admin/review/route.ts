import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { adminReviewSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin role from DB
  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = adminReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { projectId, action, feedback } = parsed.data;

  if (action === "reject" && !feedback) {
    return NextResponse.json(
      { error: "Feedback is required for rejection" },
      { status: 400 }
    );
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.status !== "submitted") {
    return NextResponse.json(
      { error: "Only submitted projects can be reviewed" },
      { status: 400 }
    );
  }

  if (action === "approve") {
    const [updated] = await db
      .update(projects)
      .set({
        status: "approved",
        approvedAt: new Date(),
        updatedAt: new Date(),
        adminFeedback: null,
      })
      .where(eq(projects.id, projectId))
      .returning();

    return NextResponse.json(updated);
  } else {
    const [updated] = await db
      .update(projects)
      .set({
        status: "rejected",
        adminFeedback: feedback!,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    return NextResponse.json(updated);
  }
}
