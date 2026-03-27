import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-sm text-gray-500 sm:flex-row sm:justify-between">
        <p>{t("tagline")}</p>
        <div className="flex gap-4">
          <a
            href="https://transformative-bildung.org"
            className="hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("mainSite")}
          </a>
        </div>
      </div>
    </footer>
  );
}
