import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import aboutTeamBg from "@/assets/images/about-team.png";

export function About() {
  return (
    <div className="w-full pt-24">
      {/* Page Header */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6" data-testid="text-about-title">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed" data-testid="text-about-subtitle">
              Built on a foundation of integrity, expertise, and unwavering commitment to client success in the Saudi market.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">A Legacy of Trust and Excellence</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Trust Hub Business Solutions was founded with a singular vision: to provide enterprises with a reliable, sophisticated partner for navigating the dynamic business landscape of Saudi Arabia.
                </p>
                <p>
                  We recognized that modern businesses require more than just transactional service providers; they need strategic partners who understand the nuances of local regulations, cultural nuances, and operational challenges. Our approach brings the rigor of premium consultancy to essential corporate services.
                </p>
                <p>
                  Today, we stand as a premier provider of corporate solutions in Riyadh, trusted by international corporations and ambitious local enterprises alike to manage their most critical compliance, administrative, and strategic needs.
                </p>
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
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Vision & Values</h2>
            <p className="text-white/70 text-lg">The principles that guide every decision we make and every service we deliver.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-primary/20 flex items-center justify-center rounded-full mb-6 text-primary">
                <span className="font-serif text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Integrity</h3>
              <p className="text-white/60 leading-relaxed">Absolute transparency and ethical conduct in all our dealings, ensuring your business is always protected.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-primary/20 flex items-center justify-center rounded-full mb-6 text-primary">
                <span className="font-serif text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Excellence</h3>
              <p className="text-white/60 leading-relaxed">A commitment to delivering premium quality service, characterized by precision, speed, and professionalism.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-primary/20 flex items-center justify-center rounded-full mb-6 text-primary">
                <span className="font-serif text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Partnership</h3>
              <p className="text-white/60 leading-relaxed">We view our clients' success as our own, acting as dedicated advisors rather than mere service providers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background text-center border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">Experience the Trust Hub Difference</h2>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href="/contact" data-testid="button-about-cta">Contact Our Team</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
