import type { ComponentType } from "react";
import { Link } from "wouter";
import { Facebook, Linkedin, Youtube, Instagram, Share2 } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useGetContactContent } from "@workspace/api-client-react";
import logoPath from "@assets/pro_180_1782647507368.jpg";
import type { Locale } from "@/i18n";

const SOCIAL_ICONS: Record<string, ComponentType<{ size?: number }>> = {
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: FaTiktok,
  instagram: Instagram,
};

export function Footer() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const currentYear = new Date().getFullYear();
  const services = t("footer.services", { returnObjects: true }) as string[];
  const { data: contact } = useGetContactContent({ locale });

  return (
    <footer className="bg-foreground text-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3" data-testid="link-footer-logo">
              <img src={logoPath} alt="Trust Hub Logo" className="h-14 w-14 rounded-full object-cover bg-white p-0.5" />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-none text-white">TRUST HUB</span>
                <span className="text-xs tracking-wider uppercase font-semibold text-primary">{t("nav.tagline")}</span>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">{t("footer.tagline")}</p>
            <div className="flex items-center gap-4">
              {(contact?.socialLinks ?? []).map(({ name, label, href }) => {
                const Icon = SOCIAL_ICONS[name] ?? Share2;
                return (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-colors"
                    data-testid={`link-social-${name}`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-white">{t("footer.quickLinks")}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-white/70 hover:text-primary transition-colors text-sm" data-testid="link-footer-home">{t("nav.home")}</Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-primary transition-colors text-sm" data-testid="link-footer-about">{t("nav.about")}</Link>
              </li>
              <li>
                <Link href="/services" className="text-white/70 hover:text-primary transition-colors text-sm" data-testid="link-footer-services">{t("nav.services")}</Link>
              </li>
              <li><Link href="/programs" className="text-white/70 hover:text-primary transition-colors text-sm">{t("nav.programs")}</Link></li>
              <li><Link href="/programs/incubator-program" className="text-white/70 hover:text-primary transition-colors text-sm">{t("nav.incubator")}</Link></li>
              <li><Link href="/programs/accelerator-program" className="text-white/70 hover:text-primary transition-colors text-sm">{t("nav.accelerator")}</Link></li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-primary transition-colors text-sm" data-testid="link-footer-contact">{t("nav.contact")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-white">{t("footer.servicesHeading")}</h3>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service} className="text-white/70 text-sm">{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-white">{t("footer.contactInfo")}</h3>
            <ul className="space-y-4">
              <li className="text-white/70 text-sm flex items-start gap-3">
                <span className="text-primary font-bold mt-0.5">A.</span>
                <span>{contact?.addressLine1}<br/>{contact?.addressLine2}</span>
              </li>
              <li className="text-white/70 text-sm flex items-center gap-3">
                <span className="text-primary font-bold">P.</span>
                <span dir="ltr">{contact?.phoneValue}</span>
              </li>
              <li className="text-white/70 text-sm flex items-center gap-3">
                <span className="text-primary font-bold">E.</span>
                <span dir="ltr">{contact?.emailValue}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm" data-testid="text-copyright">
            {t("footer.copyright", { year: currentYear })}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/50 hover:text-primary text-sm transition-colors">{t("footer.privacyPolicy")}</Link>
            <Link href="/terms" className="text-white/50 hover:text-primary text-sm transition-colors">{t("footer.termsOfService")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
