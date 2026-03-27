"use client";

import { useTranslations } from "next-intl";
import type { ProjectFormData } from "@/hooks/useProjectForm";

interface Props {
  data: ProjectFormData;
  setField: (field: keyof ProjectFormData, value: unknown) => void;
}

export function StepStory({ data, setField }: Props) {
  const t = useTranslations("submit");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t("stepStory")}</h2>

      <div>
        <label htmlFor="summary" className="mb-1 block text-sm font-medium">
          {t("summary")} *
        </label>
        <p className="mb-2 text-xs text-gray-500">{t("summaryHint")}</p>
        <textarea
          id="summary"
          value={data.summary}
          onChange={(e) => setField("summary", e.target.value)}
          rows={3}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          {t("descriptionLabel")} *
        </label>
        <p className="mb-2 text-xs text-gray-500">{t("descriptionHint")}</p>
        <textarea
          id="description"
          value={data.description}
          onChange={(e) => setField("description", e.target.value)}
          rows={12}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
