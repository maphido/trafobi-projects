"use client";

import { useTranslations } from "next-intl";

interface Props {
  value: string;
  max: number;
}

export function CharacterCount({ value, max }: Props) {
  const t = useTranslations("submit");
  const count = value?.length ?? 0;
  const over = count > max;

  return (
    <p className={`mt-1 text-right text-xs ${over ? "font-medium text-red-600" : "text-gray-400"}`}>
      {t("charCount", { count, max })}
    </p>
  );
}
