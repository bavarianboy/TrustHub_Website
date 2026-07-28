import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import aboutTeamBg from "@/assets/images/about-team.png";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

type ValueCopy = { title: string; desc: string };

export function About() {
  const { t } = useTranslation();
  useDocumentMeta(t("about.title"), t("about.subtitle"), "/about");

  const values = t("about.values", { returnObjects: true }) as ValueCopy[];

  return (
    <div className="w-full pt-24">
      {/* Page Header */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6" data-testid="text-about-title">
              {t("about.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed" data-testid="text-about-subtitle">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">{t("about.legacyHeading")}</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>{t("about.legacyParagraph1")}</p>
                <p>{t("about.legacyParagraph2")}</p>
                <p>{t("about.legacyParagraph3")}</p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative h-full min-h-[400px]">
                <img
                  src={aboutTeamBg}
                  alt="Trust Hub Team"
                  className="absolute inset-0 w-full h-full object-cover rounded-sm shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-24 bg-foreground text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">{t("about.valuesHeading")}</h2>
            <p className="text-white/70 text-lg">{t("about.valuesSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {values.map((value, idx) => (
              <div key={idx} className="p-6">
                <div className="w-16 h-16 mx-auto bg-primary/20 flex items-center justify-center rounded-full mb-6 text-primary">
                  <span className="font-serif text-2xl font-bold">{idx + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-white/60 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background text-center border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">{t("about.ctaHeading")}</h2>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href="/contact" data-testid="button-about-cta">{t("about.ctaButton")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
