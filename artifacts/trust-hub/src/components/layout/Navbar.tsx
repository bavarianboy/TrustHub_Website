import { Link, useLocation } from "wouter";
import { Menu, X, Languages, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/pro_180_1782647507368.jpg";

export function Navbar() {
  const [location] = useLocation();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);

  const isHomePage = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.services"), path: "/services" },
    { name: t("nav.programs"), path: "/programs" },
    { name: t("nav.news"), path: "/news" },
    { name: t("nav.workspace"), path: "/workspace" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  // location here is already relative to the locale-scoped router's base, so
  // it's exactly the path to preserve when switching to the other language.
  const appBase = import.meta.env.BASE_URL.replace(/\/$/, "");
  const otherLocaleHref =
    locale === "ar" ? `${appBase}${location === "/" ? "" : location}` : `${appBase}/ar${location === "/" ? "" : location}`;
  const otherLocaleLabel = locale === "ar" ? "English" : "العربية";

  const useDarkText = isScrolled || !isHomePage;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useDarkText
          ? "bg-background/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 z-50" data-testid="link-logo">
          <img src={logoPath} alt="Trust Hub Logo" className="h-16 w-16 rounded-full object-cover shadow-sm" />
          <span className={`font-serif font-bold text-xl leading-none ${useDarkText ? "text-foreground" : "text-white"}`}>
            TRUST HUB
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.path} className={link.path === "/programs" ? "relative group" : ""}>
                <Link
                  href={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.path
                      ? "text-primary"
                      : useDarkText
                      ? "text-foreground"
                      : "text-white/90"
                  }`}
                  data-testid={`link-nav-${link.path === "/" ? "home" : link.path.slice(1)}`}
                >
                  {link.name}{link.path === "/programs" && <ChevronDown size={14} className="inline ms-1" />}
                </Link>
                {link.path === "/programs" && <div className="absolute top-full start-0 pt-3 min-w-56 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity"><div className="bg-background border border-border shadow-lg rounded-sm py-2">{[["incubator-program", t("nav.incubator")], ["accelerator-program", t("nav.accelerator")]].map(([slug, label]) => <Link key={slug} href={`/programs/${slug}`} className="block px-4 py-3 text-sm text-foreground hover:bg-secondary hover:text-primary">{label}</Link>)}</div></div>}
              </li>
            ))}
          </ul>
          <a
            href={otherLocaleHref}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
              useDarkText ? "text-foreground" : "text-white/90"
            }`}
            data-testid="link-language-switch"
          >
            <Languages size={16} />
            {otherLocaleLabel}
          </a>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-sm px-6"
            asChild
          >
            <Link href="/contact" data-testid="button-get-started">{t("nav.getStarted")}</Link>
          </Button>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden z-50 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className={useDarkText || mobileMenuOpen ? "text-foreground" : "text-white"} />
          ) : (
            <Menu className={useDarkText ? "text-foreground" : "text-white"} />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-background/98 backdrop-blur-xl z-40 flex flex-col items-center justify-start overflow-y-auto py-28 transition-all duration-300 ${
            mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <ul className="flex flex-col items-center gap-8 text-xl">
            {navLinks.map((link) => (
              <li key={link.path} className="text-center">
                <Link
                  href={link.path}
                  className={`font-medium transition-colors hover:text-primary ${
                    location === link.path ? "text-primary" : "text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-nav-${link.path === "/" ? "home" : link.path.slice(1)}`}
                >
                  {link.name}
                </Link>
                {link.path === "/programs" && <><button type="button" onClick={() => setMobileProgramsOpen(open => !open)} aria-expanded={mobileProgramsOpen} aria-label={t("nav.programs")} className="ms-2 text-foreground align-middle"><ChevronDown size={18} className={mobileProgramsOpen ? "rotate-180" : ""} /></button>{mobileProgramsOpen && <div className="flex flex-col items-center gap-3 mt-4 text-base">{[["incubator-program", t("nav.incubator")], ["accelerator-program", t("nav.accelerator")]].map(([slug, label]) => <Link key={slug} href={`/programs/${slug}`} onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-primary">{label}</Link>)}</div>}</>}
              </li>
            ))}
          </ul>
          <a
            href={otherLocaleHref}
            className="mt-8 flex items-center gap-1.5 text-foreground font-medium"
            data-testid="link-mobile-language-switch"
          >
            <Languages size={18} />
            {otherLocaleLabel}
          </a>
          <Button
            className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-sm px-8 py-6 text-lg"
            asChild
            onClick={() => setMobileMenuOpen(false)}
          >
            <Link href="/contact" data-testid="button-mobile-get-started">{t("nav.getStarted")}</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
