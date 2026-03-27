"use client";

import { useTranslations } from "next-intl";
import type { ProjectFormData } from "@/hooks/useProjectForm";

interface Props {
  data: ProjectFormData;
  setField: (field: keyof ProjectFormData, value: unknown) => void;
}

export function StepResults({ data, setField }: Props) {
  const t = useTranslations("submit");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t("stepResults")}</h2>

      <div>
        <label htmlFor="impact" className="mb-1 block text-sm font-medium">
          {t("impactLabel")}
        </label>
        <p className="mb-2 text-xs text-gray-500">{t("impactHint")}</p>
        <textarea
          id="impact"
          value={data.impact}
          onChange={(e) => setField("impact", e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="challenges" className="mb-1 block text-sm font-medium">
          {t("challengesLabel")}
        </label>
        <p className="mb-2 text-xs text-gray-500">{t("challengesHint")}</p>
        <textarea
          id="challenges"
          value={data.challenges}
          onChange={(e) => setField("challenges", e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="tips" className="mb-1 block text-sm font-medium">
          {t("tipsLabel")}
        </label>
        <p className="mb-2 text-xs text-gray-500">{t("tipsHint")}</p>
        <textarea
          id="tips"
          value={data.tips}
          onChange={(e) => setField("tips", e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
