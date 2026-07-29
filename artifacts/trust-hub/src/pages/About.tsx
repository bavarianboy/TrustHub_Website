import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import aboutTeamBg from "@/assets/images/about-team.png";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useGetAboutContent } from "@workspace/api-client-react";
import type { Locale } from "@/i18n";

export function About() {
  const { i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const { data: content, isLoading, isError } = useGetAboutContent({ locale });

  useDocumentMeta(content?.title ?? "About", content?.subtitle ?? "", "/about");

  if (isLoading) {
    return (
      <div className="w-full pt-24 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-6">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !content) {
    return (
      <div className="w-full pt-24 pb-24 text-center">
        <p className="text-muted-foreground">Couldn't load this page right now. Please try again shortly.</p>
      </div>
    );
  }

  return (
    <div className="w-full pt-24">
      {/* Page Header */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6" data-testid="text-about-title">
              {content.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed" data-testid="text-about-subtitle">
              {content.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">{content.legacyHeading}</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>{content.legacyParagraph1}</p>
                <p>{content.legacyParagraph2}</p>
                <p>{content.legacyParagraph3}</p>
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
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">{content.valuesHeading}</h2>
            <p className="text-white/70 text-lg">{content.valuesSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {content.values.map((value, idx) => (
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
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">{content.ctaHeading}</h2>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href="/contact" data-testid="button-about-cta">{content.ctaButton}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
