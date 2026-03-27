"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale() {
    const nextLocale = locale === "de" ? "en" : "de";
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <button
      onClick={switchLocale}
      className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
      title={locale === "de" ? "Switch to English" : "Auf Deutsch wechseln"}
    >
      {locale === "de" ? "EN" : "DE"}
    </button>
  );
}
