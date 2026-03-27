import { z } from "zod";
import { TOPICS, INSTITUTION_TYPES, STUDY_PHASES } from "./constants";

// Reusable: URL must be http(s), no javascript: protocol
const safeUrl = z
  .string()
  .url()
  .refine((url) => /^https?:\/\//i.test(url), {
    message: "Only http and https URLs are allowed",
  });

export const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  fullName: z.string().trim().min(2).max(100),
});

export const projectCreateSchema = z.object({
  title: z.string().min(1).max(200).default("Untitled Project"),
  language: z.enum(["de", "en"]).default("de"),
  summary: z.string().max(500).nullish(),
  description: z.string().max(50000).nullish(),
  impact: z.string().max(10000).nullish(),
  challenges: z.string().max(10000).nullish(),
  tips: z.string().max(10000).nullish(),
  institutionName: z.string().max(200).nullish(),
  institutionType: z.enum([...INSTITUTION_TYPES, "" as const]).nullish(),
  country: z.string().max(10).nullish(),
  city: z.string().max(100).nullish(),
  topics: z
    .array(z.enum(TOPICS as unknown as [string, ...string[]]))
    .max(5)
    .default([]),
  studyPhase: z
    .enum(STUDY_PHASES as unknown as [string, ...string[]])
    .default("all"),
  links: z
    .array(
      z.object({
        url: safeUrl,
        label: z.string().max(100).default(""),
      })
    )
    .max(10)
    .default([]),
});

export const projectUpdateSchema = projectCreateSchema.partial().extend({
  _action: z.enum(["submit"]).optional(),
});

export const adminReviewSchema = z.object({
  projectId: z.string().uuid(),
  action: z.enum(["approve", "reject"]),
  feedback: z.string().max(2000).optional(),
});
