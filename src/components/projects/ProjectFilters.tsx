"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  COUNTRIES,
  INSTITUTION_TYPES,
  TOPICS,
  TOPIC_LABELS,
  STUDY_PHASES,
} from "@/lib/constants";

export function ProjectFilters() {
  const locale = useLocale() as "de" | "en";
  const t = useTranslations("home");
  const tTypes = useTranslations("institutionTypes");
  const tPhases = useTranslations("studyPhases");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset pagination on filter change
    router.push(`${pathname}?${params.toString()}`);
  }

  const view = searchParams.get("view") || "grid";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* View toggle */}
      <div className="flex rounded-lg border border-gray-300 overflow-hidden">
        <button
          onClick={() => setFilter("view", "grid")}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            view !== "map"
              ? "bg-primary text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          title={t("gridView")}
        >
          ▦
        </button>
        <button
          onClick={() => setFilter("view", "map")}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            view === "map"
              ? "bg-primary text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          title={t("mapView")}
        >
          ◉
        </button>
      </div>

      <select
        value={searchParams.get("country") || ""}
        onChange={(e) => setFilter("country", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
      >
        <option value="">{t("allCountries")}</option>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c[locale]}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("type") || ""}
        onChange={(e) => setFilter("type", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
      >
        <option value="">{t("allTypes")}</option>
        {INSTITUTION_TYPES.map((type) => (
          <option key={type} value={type}>
            {tTypes(type)}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("topic") || ""}
        onChange={(e) => setFilter("topic", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
      >
        <option value="">{t("allTopics")}</option>
        {TOPICS.map((topic) => (
          <option key={topic} value={topic}>
            {TOPIC_LABELS[topic]?.[locale] || topic}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("phase") || ""}
        onChange={(e) => setFilter("phase", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
      >
        <option value="">{t("allPhases")}</option>
        {STUDY_PHASES.map((phase) => (
          <option key={phase} value={phase}>
            {tPhases(phase)}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("lang") || ""}
        onChange={(e) => setFilter("lang", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
      >
        <option value="">{t("filterByLanguage")}</option>
        <option value="de">Deutsch</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
