import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Building2, Briefcase, FileText, Calculator, Users, CheckCircle2 } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const serviceIcons: Record<string, typeof Building2> = {
  "business-setup": Building2,
  "pro-services": FileText,
  "hr-payroll": Users,
  "accounting-tax": Calculator,
  "business-consultancy": Briefcase,
  "corporate-documents": CheckCircle2,
};

type ServiceCopy = { id: string; title: string; description: string; features: string[] };

export function Services() {
  const { t } = useTranslation();
  useDocumentMeta(t("services.title"), t("services.subtitle"), "/services");

  const services = t("services.list", { returnObjects: true }) as ServiceCopy[];

  return (
    <div className="w-full pt-24">
      {/* Page Header */}
      <section className="py-16 md:py-24 bg-foreground text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6" data-testid="text-services-title">
              {t("services.title")}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed" data-testid="text-services-subtitle">
              {t("services.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail List */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-24">
            {services.map((service, index) => {
              const Icon = serviceIcons[service.id] ?? Building2;
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}
                  data-testid={`section-service-${service.id}`}
                >
                  <div className="lg:w-1/2">
                    <div className="mb-6 p-4 inline-block bg-secondary rounded-lg">
                      <Icon className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                      {service.title}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                      {service.description}
                    </p>

                    <div className="bg-secondary p-8 rounded-sm border border-border">
                      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        {t("services.keyCapabilities")}
                      </h3>
                      <ul className="space-y-3">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:w-1/2 w-full">
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center rounded-sm overflow-hidden relative group">
                      <div className="absolute inset-0 bg-foreground/5 pattern-grid-lg"></div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-background/40 to-transparent"></div>
                      <div className="z-10 text-primary opacity-20 transform scale-150 group-hover:scale-110 transition-transform duration-700">
                        <Icon className="w-12 h-12" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">{t("services.ctaHeading")}</h2>
          <p className="text-primary-foreground/90 text-lg mb-10">
            {t("services.ctaParagraph")}
          </p>
          <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-white px-8 py-6 text-lg" asChild>
            <Link href="/contact" data-testid="button-services-cta">{t("services.ctaButton")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
