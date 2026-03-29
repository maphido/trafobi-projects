"use client";

import { useTranslations } from "next-intl";
import type { ProjectFormData } from "@/hooks/useProjectForm";
import { CharacterCount } from "./CharacterCount";

const LIMIT = 10000;

interface Props {
  data: ProjectFormData;
  setField: (field: keyof ProjectFormData, value: unknown) => void;
}

function borderClass(value: string | undefined, max: number) {
  return (value?.length ?? 0) > max
    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-primary focus:ring-primary";
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
        <p className="mb-2 text-xs text-gray-500">
          {t("impactHint", { max: LIMIT.toLocaleString() })}
        </p>
        <textarea
          id="impact"
          value={data.impact}
          onChange={(e) => setField("impact", e.target.value)}
          rows={5}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${borderClass(data.impact, LIMIT)}`}
        />
        <CharacterCount value={data.impact ?? ""} max={LIMIT} />
      </div>

      <div>
        <label htmlFor="challenges" className="mb-1 block text-sm font-medium">
          {t("challengesLabel")}
        </label>
        <p className="mb-2 text-xs text-gray-500">
          {t("challengesHint", { max: LIMIT.toLocaleString() })}
        </p>
        <textarea
          id="challenges"
          value={data.challenges}
          onChange={(e) => setField("challenges", e.target.value)}
          rows={5}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${borderClass(data.challenges, LIMIT)}`}
        />
        <CharacterCount value={data.challenges ?? ""} max={LIMIT} />
      </div>

      <div>
        <label htmlFor="tips" className="mb-1 block text-sm font-medium">
          {t("tipsLabel")}
        </label>
        <p className="mb-2 text-xs text-gray-500">
          {t("tipsHint", { max: LIMIT.toLocaleString() })}
        </p>
        <textarea
          id="tips"
          value={data.tips}
          onChange={(e) => setField("tips", e.target.value)}
          rows={5}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${borderClass(data.tips, LIMIT)}`}
        />
        <CharacterCount value={data.tips ?? ""} max={LIMIT} />
      </div>
    </div>
  );
}
