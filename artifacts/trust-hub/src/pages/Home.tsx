import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Briefcase, FileText, Calculator, Users, CheckCircle2 } from "lucide-react";
import heroBg from "@/assets/images/hero-bg.png";
import luxuryAbstract from "@/assets/images/luxury-abstract.png";

export function Home() {
  const services = [
    {
      icon: <Building2 className="w-8 h-8 mb-4 text-primary" />,
      title: "Business Setup",
      desc: "End-to-end company registration and licensing services in KSA."
    },
    {
      icon: <FileText className="w-8 h-8 mb-4 text-primary" />,
      title: "PRO Services",
      desc: "Efficient handling of all government relations and documentation."
    },
    {
      icon: <Users className="w-8 h-8 mb-4 text-primary" />,
      title: "HR & Payroll",
      desc: "Comprehensive HR management and compliant payroll solutions."
    },
    {
      icon: <Calculator className="w-8 h-8 mb-4 text-primary" />,
      title: "Accounting & Tax",
      desc: "Expert financial reporting, bookkeeping, and tax compliance."
    },
    {
      icon: <Briefcase className="w-8 h-8 mb-4 text-primary" />,
      title: "Business Consultancy",
      desc: "Strategic advisory for market entry and operational optimization."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 mb-4 text-primary" />,
      title: "Corporate Documents",
      desc: "Drafting, attestation, and translation of vital business records."
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Modern Saudi Business District" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-semibold tracking-wider uppercase mb-6" data-testid="text-hero-badge">
              Excellence in Consulting
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-6" data-testid="text-hero-title">
              Empowering Your <br/><span className="text-primary">Business Vision</span><br/> in Saudi Arabia
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed" data-testid="text-hero-subtitle">
              Trust Hub delivers premium business solutions, strategic consulting, and seamless operational support for enterprises navigating the Saudi market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-sm" asChild>
                <Link href="/services" data-testid="button-hero-services">Our Services</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-foreground px-8 py-6 text-lg rounded-sm bg-transparent" asChild>
                <Link href="/contact" data-testid="button-hero-contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Welcome to Trust Hub</h2>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 leading-tight">
                Your Trusted Partner for Corporate Success in the Kingdom.
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                We provide a comprehensive suite of corporate services designed to streamline your operations, ensure regulatory compliance, and accelerate your growth. Our executive approach guarantees that every detail is handled with precision and professionalism.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                From initial market entry and licensing to ongoing HR management and financial consulting, our dedicated team acts as an extension of your own business, allowing you to focus on what matters most — your core vision.
              </p>
              <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto font-semibold text-base group" asChild>
                <Link href="/about" className="flex items-center gap-2" data-testid="link-discover-more">
                  Discover our story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="aspect-square max-w-md mx-auto relative">
                <img src={luxuryAbstract} alt="Executive environment" className="w-full h-full object-cover rounded-sm shadow-2xl z-10 relative" />
                <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary rounded-sm z-0"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary rounded-sm z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Our Expertise</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">Comprehensive Business Solutions</h3>
            <p className="text-muted-foreground">Tailored strategies and meticulous execution across every facet of your corporate operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="bg-background p-8 rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 border border-border group" data-testid={`card-service-${idx}`}>
                <div className="transform group-hover:-translate-y-1 transition-transform duration-300">
                  {service.icon}
                  <h4 className="text-xl font-serif font-bold text-foreground mb-3">{service.title}</h4>
                  <p className="text-muted-foreground mb-6">{service.desc}</p>
                  <Link href="/services" className="text-primary font-medium flex items-center gap-2 text-sm uppercase tracking-wide group/link">
                    Learn More <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-foreground text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Why Trust Hub</h2>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight">
                The Executive Standard in Consulting
              </h3>
              <p className="text-white/70 leading-relaxed mb-8">
                We don't just process paperwork; we partner in your success. Our deep understanding of the Saudi regulatory landscape combined with our commitment to white-glove service sets us apart.
              </p>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-l-2 border-primary/30 pl-6 py-2">
                <h4 className="text-4xl font-serif font-bold text-primary mb-2">15+</h4>
                <p className="text-white font-bold mb-2">Years of Expertise</p>
                <p className="text-white/60 text-sm">Deep domain knowledge navigating the complexities of Saudi corporate regulations.</p>
              </div>
              <div className="border-l-2 border-primary/30 pl-6 py-2">
                <h4 className="text-4xl font-serif font-bold text-primary mb-2">500+</h4>
                <p className="text-white font-bold mb-2">Businesses Setup</p>
                <p className="text-white/60 text-sm">Successfully guided hundreds of enterprises through market entry and establishment.</p>
              </div>
              <div className="border-l-2 border-primary/30 pl-6 py-2">
                <h4 className="text-4xl font-serif font-bold text-primary mb-2">100%</h4>
                <p className="text-white font-bold mb-2">Compliance Rate</p>
                <p className="text-white/60 text-sm">Flawless track record in maintaining regulatory alignment for our clients.</p>
              </div>
              <div className="border-l-2 border-primary/30 pl-6 py-2">
                <h4 className="text-4xl font-serif font-bold text-primary mb-2">24/7</h4>
                <p className="text-white font-bold mb-2">Dedicated Support</p>
                <p className="text-white/60 text-sm">Unwavering commitment to client responsiveness and operational continuity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">Ready to Elevate Your Business?</h2>
          <p className="text-primary-foreground/90 text-lg mb-10 max-w-2xl mx-auto">
            Schedule a confidential consultation with our senior advisors and discover how Trust Hub can accelerate your success in Saudi Arabia.
          </p>
          <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-white px-10 py-7 text-lg rounded-sm" asChild>
            <Link href="/contact" data-testid="button-final-cta">Request a Consultation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
