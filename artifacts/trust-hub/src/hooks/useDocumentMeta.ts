import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const SITE_NAME = "Trust Hub Business Solutions";

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setLinkTag(rel: string, hreflang: string | null, href: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    if (hreflang) tag.setAttribute("hreflang", hreflang);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

// Sets <title>, description, and hreflang alternates for the current route.
// `path` is locale-agnostic (e.g. "/services", not "/ar/services") — the hook
// derives both language versions' URLs from it.
//
// Locale comes from i18n.language, NOT from re-deriving it via wouter's
// useLocation(): this hook is always called from within a page component,
// which sits inside the locale-scoped Router — its useLocation() already has
// the "/ar" prefix stripped by that Router's `base`, so re-parsing it here
// would misdetect every locale as "en".
export function useDocumentMeta(title: string, description: string, path: string) {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    setMetaTag("name", "description", description);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);

    const origin = window.location.origin;
    const enPath = path === "/" ? "/" : path;
    const arPath = path === "/" ? "/ar" : `/ar${path}`;
    setLinkTag("alternate", "en", `${origin}${enPath}`);
    setLinkTag("alternate", "ar", `${origin}${arPath}`);
    setLinkTag("alternate", "x-default", `${origin}${enPath}`);
    setLinkTag("canonical", null, `${origin}${locale === "ar" ? arPath : enPath}`);
  }, [locale, title, description, path]);
}
