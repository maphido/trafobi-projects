"use client";

import { useTranslations } from "next-intl";
import type { ProjectFormData } from "@/hooks/useProjectForm";

interface Props {
  data: ProjectFormData;
  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
  onUpdateLink: (index: number, field: "url" | "label", value: string) => void;
}

export function StepLinks({ data, onAddLink, onRemoveLink, onUpdateLink }: Props) {
  const t = useTranslations("submit");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t("stepLinks")}</h2>

      <div>
        <label className="mb-2 block text-sm font-medium">
          {t("linksLabel")}
        </label>

        {data.links.map((link, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <input
              type="url"
              placeholder={t("linkUrl")}
              value={link.url}
              onChange={(e) => onUpdateLink(i, "url", e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              placeholder={t("linkLabel")}
              value={link.label}
              onChange={(e) => onUpdateLink(i, "label", e.target.value)}
              maxLength={100}
              className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => onRemoveLink(i)}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              &times;
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddLink}
          className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
        >
          + {t("addLink")}
        </button>
      </div>
    </div>
  );
}
