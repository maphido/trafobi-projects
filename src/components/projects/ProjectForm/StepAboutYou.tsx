"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import type { ProjectFormData } from "@/hooks/useProjectForm";

interface Props {
  data: ProjectFormData;
  setField: (field: keyof ProjectFormData, value: unknown) => void;
}

export function StepAboutYou({ data, setField }: Props) {
  const t = useTranslations("submit");
  const { data: session } = useSession();

  // Pre-fill from session on first load
  useEffect(() => {
    if (session?.user?.name && !data.authorName) {
      setField("authorName", session.user.name);
    }
  }, [session, data.authorName, setField]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t("stepAbout")}</h2>

      <div>
        <label htmlFor="authorName" className="mb-1 block text-sm font-medium">
          {t("institution")}
        </label>
        <input
          id="authorName"
          type="text"
          value={data.authorName}
          onChange={(e) => setField("authorName", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          disabled
        />
        <p className="mt-1 text-xs text-gray-400">
          {session?.user?.email}
        </p>
      </div>

      <div>
        <label htmlFor="authorInstitution" className="mb-1 block text-sm font-medium">
          {t("institutionName")}
        </label>
        <input
          id="authorInstitution"
          type="text"
          value={data.authorInstitution}
          onChange={(e) => setField("authorInstitution", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="authorBio" className="mb-1 block text-sm font-medium">
          Bio
        </label>
        <textarea
          id="authorBio"
          value={data.authorBio}
          onChange={(e) => setField("authorBio", e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
