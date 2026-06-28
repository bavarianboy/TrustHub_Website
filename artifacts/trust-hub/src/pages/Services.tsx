import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Building2, Briefcase, FileText, Calculator, Users, CheckCircle2, ArrowRight } from "lucide-react";

export function Services() {
  const services = [
    {
      id: "business-setup",
      icon: <Building2 className="w-12 h-12 text-primary" />,
      title: "Business Setup & Licensing",
      description: "Comprehensive end-to-end support for establishing your corporate presence in Saudi Arabia. We handle the complexities of company formation so you can focus on strategy.",
      features: [
        "Commercial Registration (CR) issuance",
        "MISA (SAGIA) license acquisition",
        "Chamber of Commerce registration",
        "Article of Association drafting",
        "Virtual and physical office setup support"
      ]
    },
    {
      id: "pro-services",
      icon: <FileText className="w-12 h-12 text-primary" />,
      title: "PRO Services",
      description: "Expert government relations to ensure your business remains compliant and operational without administrative delays.",
      features: [
        "Muqeem and Qiwa portal management",
        "Ministry of Labor (MOL) services",
        "GOSI registration and compliance",
        "Visas, Iqamas, and exit/re-entry processing",
        "Government fee payment management"
      ]
    },
    {
      id: "hr-payroll",
      icon: <Users className="w-12 h-12 text-primary" />,
      title: "HR & Payroll Solutions",
      description: "Scalable human resources management and compliant payroll processing designed for the Saudi regulatory environment.",
      features: [
        "WPS (Wage Protection System) compliance",
        "Employment contract drafting (Saudi labor law)",
        "End of service benefits calculation",
        "Employee onboarding and offboarding",
        "Policy manual development"
      ]
    },
    {
      id: "accounting-tax",
      icon: <Calculator className="w-12 h-12 text-primary" />,
      title: "Accounting & Tax Compliance",
      description: "Rigorous financial management ensuring accuracy, transparency, and full adherence to ZATCA regulations.",
      features: [
        "ZATCA VAT registration and filing",
        "Corporate tax and Zakat returns",
        "Monthly bookkeeping and reporting",
        "E-invoicing implementation support",
        "Financial auditing preparation"
      ]
    },
    {
      id: "business-consultancy",
      icon: <Briefcase className="w-12 h-12 text-primary" />,
      title: "Business Consultancy",
      description: "Strategic advisory services to optimize your operations, enter new markets, and drive sustainable growth.",
      features: [
        "Saudi market entry strategy",
        "Feasibility studies and risk analysis",
        "Operational efficiency audits",
        "Local partnership facilitation",
        "Corporate restructuring"
      ]
    },
    {
      id: "corporate-documents",
      icon: <CheckCircle2 className="w-12 h-12 text-primary" />,
      title: "Corporate Document Services",
      description: "Professional handling of critical business documentation, ensuring legal validity and proper formatting.",
      features: [
        "Legal translation (Arabic/English)",
        "Document attestation and notarization",
        "Power of Attorney drafting",
        "Board resolution documentation",
        "Corporate profiling and company portfolios"
      ]
    }
  ];

  return (
    <div className="w-full pt-24">
      {/* Page Header */}
      <section className="py-16 md:py-24 bg-foreground text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6" data-testid="text-services-title">
              Our Services
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed" data-testid="text-services-subtitle">
              A comprehensive suite of corporate solutions, executed with precision to support your business at every stage of growth.
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail List */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                id={service.id}
                className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}
                data-testid={`section-service-${service.id}`}
              >
                <div className="lg:w-1/2">
                  <div className="mb-6 p-4 inline-block bg-secondary rounded-lg">
                    {service.icon}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {service.description}
                  </p>
                  
                  <div className="bg-secondary p-8 rounded-sm border border-border">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      Key Capabilities
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
                     {/* Decorative background instead of an image to keep it clean if no specific image is available, 
                         but providing a very structured architectural feel */}
                    <div className="absolute inset-0 bg-foreground/5 pattern-grid-lg"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-background/40 to-transparent"></div>
                    <div className="z-10 text-primary opacity-20 transform scale-150 group-hover:scale-110 transition-transform duration-700">
                      {service.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">Need a Custom Solution?</h2>
          <p className="text-primary-foreground/90 text-lg mb-10">
            Every business is unique. Contact our team to discuss your specific requirements and let us tailor a service package for your needs.
          </p>
          <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-white px-8 py-6 text-lg" asChild>
            <Link href="/contact" data-testid="button-services-cta">Contact an Advisor</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
