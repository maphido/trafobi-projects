import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  real,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  institution: text("institution"),
  country: text("country"),
  bio: text("bio"),
  experience: text("experience"),
  expertise: text("expertise").array().default([]),
  availableAsExpert: boolean("available_as_expert").notNull().default(false),
  avatarUrl: text("avatar_url"),
  role: text("role").notNull().default("user"), // 'user' | 'admin'
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").unique(),
    language: text("language").notNull().default("de"), // 'de' | 'en'

    // Content
    title: text("title").notNull(),
    summary: text("summary"),
    description: text("description"), // Markdown
    impact: text("impact"),
    challenges: text("challenges"),
    tips: text("tips"),

    // Institution
    institutionName: text("institution_name"),
    institutionType: text("institution_type"), // 'university' | 'fh' | 'art_school' | 'other'
    country: text("country"),
    city: text("city"),
    address: text("address"), // Street address for precise map placement

    // Classification
    topics: text("topics").array().default([]),
    studyPhase: text("study_phase").default("all"), // 'bachelor' | 'master' | 'all'
    projectPhase: text("project_phase").default("planning"), // 'planning' | 'development' | 'active' | 'completed'
    isResearch: boolean("is_research").notNull().default(false),

    // Workflow
    status: text("status").notNull().default("draft"), // 'draft' | 'submitted' | 'approved' | 'rejected'
    adminFeedback: text("admin_feedback"),

    // Geolocation (set on approval via Nominatim geocoding)
    latitude: real("latitude"),
    longitude: real("longitude"),

    // Media
    thumbnailUrl: text("thumbnail_url"),
    links: jsonb("links").default([]), // [{url, label}]

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_projects_status").on(table.status),
    index("idx_projects_author").on(table.authorId),
    index("idx_projects_country").on(table.country),
    index("idx_projects_language").on(table.language),
  ]
);

export const projectMedia = pgTable(
  "project_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    filePath: text("file_path").notNull(),
    originalName: text("original_name"),
    mimeType: text("mime_type"),
    caption: text("caption"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_media_project").on(table.projectId)]
);

export const projectUpdates = pgTable(
  "project_updates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_updates_project").on(table.projectId)]
);

// Type exports inferred from schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ProjectMedia = typeof projectMedia.$inferSelect;
export type NewProjectMedia = typeof projectMedia.$inferInsert;
export type ProjectUpdate = typeof projectUpdates.$inferSelect;
export type NewProjectUpdate = typeof projectUpdates.$inferInsert;
