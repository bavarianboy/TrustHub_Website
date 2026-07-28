import { useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/i18n";

// Arabic is served under a /ar path prefix rather than a stateful toggle, so
// each language gets its own indexable URL. Locale is derived from the raw
// (unprefixed) pathname — see App.tsx, which reads this before mounting the
// locale-scoped wouter Router that strips the prefix for route matching.
export function localeFromPath(pathname: string): Locale {
  return pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en";
}

export function useLocale(): { locale: Locale; localeBase: string } {
  const [rawLocation] = useLocation();
  const locale = localeFromPath(rawLocation);
  const { i18n } = useTranslation();

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale, i18n]);

  return {
    locale,
    localeBase: locale === "ar" ? "/ar" : "",
  };
}
