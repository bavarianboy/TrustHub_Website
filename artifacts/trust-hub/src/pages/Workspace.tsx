import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Users,
  Wifi,
  Coffee,
  MapPin,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  Building2,
  Presentation,
  Briefcase,
} from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const workspaceIcons = [Monitor, Users, Presentation, Briefcase];
const amenityIcons = [Wifi, Coffee, Monitor, Building2, Users, Presentation];

type WorkspaceTypeCopy = { name: string; tagline: string; description: string; features: string[]; price: string };
type FaqCopy = { q: string; a: string };

export function Workspace() {
  const { t } = useTranslation();
  useDocumentMeta(t("workspace.title"), t("workspace.subtitle"), "/workspace");

  const workspaceTypes = t("workspace.types", { returnObjects: true }) as WorkspaceTypeCopy[];
  const amenities = t("workspace.amenities", { returnObjects: true }) as string[];
  const faqs = t("workspace.faqs", { returnObjects: true }) as FaqCopy[];

  return (
    <div className="w-full pt-24">
      {/* Page Header */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6"
              data-testid="text-workspace-title"
            >
              {t("workspace.title")}
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              data-testid="text-workspace-subtitle"
            >
              {t("workspace.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm px-8"
                asChild
              >
                <Link href="/contact" data-testid="button-workspace-book">{t("workspace.bookTour")}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-sm px-8"
                asChild
              >
                <Link href="/contact" data-testid="button-workspace-enquire">{t("workspace.enquireNow")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace Types */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold tracking-widest text-primary uppercase">
              {t("workspace.offerEyebrow")}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              {t("workspace.offerHeading")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workspaceTypes.map((ws, idx) => {
              const Icon = workspaceIcons[idx] ?? Monitor;
              return (
                <div
                  key={ws.name}
                  className="group p-8 rounded-lg border border-border bg-card hover:border-primary hover:shadow-xl transition-all duration-300"
                  data-testid={`card-workspace-${idx}`}
                >
                  <div className="mb-5"><Icon className="w-8 h-8 text-primary" /></div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-1">
                    {ws.name}
                  </h3>
                  <p className="text-primary text-sm font-medium italic mb-4">{ws.tagline}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {ws.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {ws.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="font-semibold text-foreground">{ws.price}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-sm border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      asChild
                    >
                      <Link href="/contact" data-testid={`button-workspace-enquire-${idx}`}>
                        {t("workspace.getQuote")}
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold tracking-widest text-primary uppercase">
              {t("workspace.amenitiesEyebrow")}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              {t("workspace.amenitiesHeading")}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((label, idx) => {
              const Icon = amenityIcons[idx] ?? Wifi;
              return (
                <div
                  key={label}
                  className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card border border-border text-center hover:border-primary transition-colors"
                  data-testid={`card-amenity-${idx}`}
                >
                  <div className="text-primary"><Icon size={22} /></div>
                  <span className="text-sm font-medium text-foreground leading-snug">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold tracking-widest text-primary uppercase">
                {t("workspace.locationEyebrow")}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6">
                {t("workspace.locationHeading")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t("workspace.locationParagraph")}
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4" data-testid="text-workspace-address">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">{t("workspace.addressLabel")}</p>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">
                      {t("workspace.addressValue")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-testid="text-workspace-hours">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">{t("workspace.hoursLabel")}</p>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">
                      {t("workspace.hoursValue")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-testid="text-workspace-phone">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">{t("workspace.phoneLabel")}</p>
                    <p className="text-muted-foreground text-sm" dir="ltr">{t("workspace.phoneValue")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-testid="text-workspace-email">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">{t("workspace.emailLabel")}</p>
                    <p className="text-muted-foreground text-sm" dir="ltr">{t("workspace.emailValue")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-border h-96 bg-secondary flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin size={48} className="mx-auto mb-4 text-primary/40" />
                <p className="text-sm">{t("workspace.mapPlaceholder")}</p>
                <p className="text-xs">{t("workspace.mapAddress")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold tracking-widest text-primary uppercase">
              {t("workspace.faqEyebrow")}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              {t("workspace.faqHeading")}
            </h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-lg bg-card border border-border"
                data-testid={`card-faq-${i}`}
              >
                <h3 className="font-semibold text-foreground mb-3 flex items-start gap-3">
                  <span className="text-primary font-bold shrink-0">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed ps-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-foreground text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            {t("workspace.ctaHeading")}
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
            {t("workspace.ctaParagraph")}
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm px-10 py-6 text-lg"
            asChild
          >
            <Link href="/contact" data-testid="button-workspace-cta-tour">{t("workspace.ctaButton")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
