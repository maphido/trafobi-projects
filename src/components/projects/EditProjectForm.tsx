"use client";

import { useEffect } from "react";
import { ProjectForm } from "./ProjectForm";
import { useProjectForm } from "@/hooks/useProjectForm";
import type { Project } from "@/lib/db/schema";

export function EditProjectForm({ project }: { project: Project }) {
  const { loadProject } = useProjectForm();

  useEffect(() => {
    loadProject(project as unknown as Record<string, unknown>);
  }, [project, loadProject]);

  return <ProjectForm />;
}
