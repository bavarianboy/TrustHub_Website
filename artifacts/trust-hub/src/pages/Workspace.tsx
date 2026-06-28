import { Link } from "wouter";
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

const workspaceTypes = [
  {
    icon: <Monitor className="w-8 h-8 text-primary" />,
    name: "Private Offices",
    tagline: "Your team. Your space.",
    description:
      "Fully furnished private offices for teams of 1–20, available on flexible monthly terms. Enjoy a dedicated, professional environment with 24/7 access.",
    features: ["Dedicated desk & ergonomic chair", "High-speed fiber internet", "24/7 secure access", "Mail & courier handling"],
    price: "From SAR 2,500 / month",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    name: "Co-working Desks",
    tagline: "Collaborate. Connect. Create.",
    description:
      "Hot-desk or dedicated desk memberships in a vibrant, professional co-working floor. Ideal for freelancers, startups, and remote professionals.",
    features: ["Flexible day or monthly passes", "Access to all common areas", "Community events & networking", "Printer & scanner access"],
    price: "From SAR 750 / month",
  },
  {
    icon: <Presentation className="w-8 h-8 text-primary" />,
    name: "Meeting Rooms",
    tagline: "Impress every client.",
    description:
      "Fully equipped meeting rooms for 4 to 20 people, available by the hour. Ideal for client presentations, interviews, and board sessions.",
    features: ["4K display & video conferencing", "Whiteboard & presentation tools", "Catering on request", "Same-day booking available"],
    price: "From SAR 150 / hour",
  },
  {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    name: "Virtual Office",
    tagline: "A prestigious address, zero overhead.",
    description:
      "Establish a professional Saudi business address without a physical office. Includes mail handling, a local phone number, and on-demand meeting room credits.",
    features: ["Riyadh CBD business address", "Mail receiving & forwarding", "Local phone answering service", "5 free meeting room hours/month"],
    price: "From SAR 450 / month",
  },
];

const amenities = [
  { icon: <Wifi size={22} />, label: "1 Gbps Fiber Internet" },
  { icon: <Coffee size={22} />, label: "Premium Coffee & Tea" },
  { icon: <Monitor size={22} />, label: "Dual Monitor Setups" },
  { icon: <Building2 size={22} />, label: "Reception & Concierge" },
  { icon: <Users size={22} />, label: "Community Lounge" },
  { icon: <Presentation size={22} />, label: "Event & Training Hall" },
];

const faqs = [
  {
    q: "What is the minimum contract length for a private office?",
    a: "We offer flexible terms starting from one month. Longer commitments (3, 6, or 12 months) come with preferential pricing.",
  },
  {
    q: "Can I use the workspace address for my commercial registration (CR)?",
    a: "Yes. Our Virtual Office and Private Office packages include a valid Riyadh address that can be used for your commercial registration with MISA and the Ministry of Commerce.",
  },
  {
    q: "Is there parking available?",
    a: "Yes, dedicated parking spaces are available in the building's basement car park for private office members. Co-working members receive discounted validation.",
  },
  {
    q: "Do you provide IT support on-site?",
    a: "Our in-house IT team handles network issues, printer setup, and device connectivity during business hours. After-hours support is available for private office members.",
  },
];

export function Workspace() {
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
              Our Workspace
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              data-testid="text-workspace-subtitle"
            >
              Premium, flexible workspaces in the heart of Riyadh — designed for businesses that value professionalism, productivity, and presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm px-8"
                asChild
              >
                <Link href="/contact" data-testid="button-workspace-book">Book a Tour</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-sm px-8"
                asChild
              >
                <Link href="/contact" data-testid="button-workspace-enquire">Enquire Now</Link>
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
              What We Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Choose Your Ideal Setup
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workspaceTypes.map((ws) => (
              <div
                key={ws.name}
                className="group p-8 rounded-lg border border-border bg-card hover:border-primary hover:shadow-xl transition-all duration-300"
                data-testid={`card-workspace-${ws.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="mb-5">{ws.icon}</div>
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
                    <Link href="/contact" data-testid={`button-workspace-enquire-${ws.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      Get a Quote
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold tracking-widest text-primary uppercase">
              Included in All Plans
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              World-Class Amenities
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((a) => (
              <div
                key={a.label}
                className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card border border-border text-center hover:border-primary transition-colors"
                data-testid={`card-amenity-${a.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="text-primary">{a.icon}</div>
                <span className="text-sm font-medium text-foreground leading-snug">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold tracking-widest text-primary uppercase">
                Location
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6">
                Centrally Located in Riyadh
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our workspace is situated in the heart of Riyadh's business district, offering convenient access to government ministries, financial institutions, and major corporate headquarters.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4" data-testid="text-workspace-address">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">Address</p>
                    <p className="text-muted-foreground text-sm">
                      King Fahd Road, Olaya District<br />
                      Riyadh 12211, Saudi Arabia
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-testid="text-workspace-hours">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">Access Hours</p>
                    <p className="text-muted-foreground text-sm">
                      Co-working: Sun–Thu, 8:00 AM – 8:00 PM<br />
                      Private Offices: 24/7
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-testid="text-workspace-phone">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">Phone</p>
                    <p className="text-muted-foreground text-sm">+966 11 000 0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-testid="text-workspace-email">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">Email</p>
                    <p className="text-muted-foreground text-sm">workspace@trusthub.sa</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-border h-96 bg-secondary flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin size={48} className="mx-auto mb-4 text-primary/40" />
                <p className="text-sm">Map integration available</p>
                <p className="text-xs">King Fahd Road, Olaya, Riyadh</p>
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
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Common Questions
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
                <p className="text-muted-foreground text-sm leading-relaxed pl-6">
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
            Ready to See the Space?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
            Book a complimentary tour and experience our workspace first-hand. Our team will walk you through every option and help you find the perfect fit.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm px-10 py-6 text-lg"
            asChild
          >
            <Link href="/contact" data-testid="button-workspace-cta-tour">Book Your Tour</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
