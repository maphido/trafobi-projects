"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header() {
  const t = useTranslations("nav");
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-xl font-bold text-transparent">
            TraBi
          </span>
          <span className="hidden text-sm text-gray-500 sm:inline">
            {t("home")}
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {session && (
            <>
              <Link
                href="/projects/submit"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/projects/submit"
                    ? "text-primary"
                    : "text-gray-600"
                }`}
              >
                {t("submit")}
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/dashboard" ? "text-primary" : "text-gray-600"
                }`}
              >
                {t("dashboard")}
              </Link>
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/admin" ? "text-primary" : "text-gray-600"
                  }`}
                >
                  {t("admin")}
                </Link>
              )}
            </>
          )}

          <LocaleSwitcher />

          {session ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-gray-600 sm:inline">
                {session.user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                {t("login")}
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-gradient-to-r from-primary to-primary-dark px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                {t("register")}
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
