"use client";

import { ProjectForm } from "./ProjectForm";
import type { Project } from "@/lib/db/schema";

export function EditProjectForm({ project }: { project: Project }) {
  return <ProjectForm originalStatus={project.status} initialProject={project as unknown as Record<string, unknown>} />;
}
