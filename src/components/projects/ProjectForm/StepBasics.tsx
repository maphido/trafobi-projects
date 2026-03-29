"use client";

import { useTranslations, useLocale } from "next-intl";
import type { ProjectFormData } from "@/hooks/useProjectForm";
import {
  COUNTRIES,
  INSTITUTION_TYPES,
  STUDY_PHASES,
  TOPICS,
  TOPIC_LABELS,
} from "@/lib/constants";

interface Props {
  data: ProjectFormData;
  setField: (field: keyof ProjectFormData, value: unknown) => void;
}

export function StepBasics({ data, setField }: Props) {
  const t = useTranslations("submit");
  const tTypes = useTranslations("institutionTypes");
  const tPhases = useTranslations("studyPhases");
  const locale = useLocale() as "de" | "en";

  function toggleTopic(topic: string) {
    const current = data.topics;
    if (current.includes(topic)) {
      setField("topics", current.filter((t) => t !== topic));
    } else {
      setField("topics", [...current, topic]);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t("stepBasics")}</h2>

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          {t("projectTitle")} *
        </label>
        <input
          id="title"
          type="text"
          value={data.title}
          onChange={(e) => setField("title", e.target.value)}
          maxLength={200}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="language" className="mb-1 block text-sm font-medium">
            {t("language")}
          </label>
          <select
            id="language"
            value={data.language}
            onChange={(e) => setField("language", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label htmlFor="institutionType" className="mb-1 block text-sm font-medium">
            {t("institution")}
          </label>
          <select
            id="institutionType"
            value={data.institutionType}
            onChange={(e) => setField("institutionType", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">--</option>
            {INSTITUTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {tTypes(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="institutionName" className="mb-1 block text-sm font-medium">
          {t("institutionName")}
        </label>
        <input
          id="institutionName"
          type="text"
          value={data.institutionName}
          onChange={(e) => setField("institutionName", e.target.value)}
          maxLength={200}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className="mb-1 block text-sm font-medium">
            {t("country")}
          </label>
          <select
            id="country"
            value={data.country}
            onChange={(e) => setField("country", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">--</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c[locale]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="mb-1 block text-sm font-medium">
            {t("city")}
          </label>
          <input
            id="city"
            type="text"
            value={data.city}
            onChange={(e) => setField("city", e.target.value)}
            maxLength={100}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="mb-1 block text-sm font-medium">
          {t("address")}
        </label>
        <input
          id="address"
          type="text"
          value={data.address}
          onChange={(e) => setField("address", e.target.value)}
          maxLength={200}
          placeholder={t("addressHint")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="studyPhase" className="mb-1 block text-sm font-medium">
          {t("studyPhaseLabel")}
        </label>
        <select
          id="studyPhase"
          value={data.studyPhase}
          onChange={(e) => setField("studyPhase", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {STUDY_PHASES.map((phase) => (
            <option key={phase} value={phase}>
              {tPhases(phase)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          {t("topicsLabel")}
        </label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                data.topics.includes(topic)
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {TOPIC_LABELS[topic]?.[locale] || topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
