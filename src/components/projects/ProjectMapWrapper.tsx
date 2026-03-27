"use client";

import dynamic from "next/dynamic";
import type { MapProject } from "./ProjectMap";

const ProjectMap = dynamic(() => import("./ProjectMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full animate-pulse rounded-lg bg-gray-100 sm:h-[600px]" />
  ),
});

export function ProjectMapWrapper({ projects }: { projects: MapProject[] }) {
  return <ProjectMap projects={projects} />;
}
