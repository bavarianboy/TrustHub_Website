import { Link } from "wouter";
import { Linkedin, Twitter, Instagram, Phone } from "lucide-react";
import logoPath from "@assets/pro_180_1782647507368.jpg";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3" data-testid="link-footer-logo">
              <img src={logoPath} alt="Trust Hub Logo" className="h-14 w-14 rounded-full object-cover bg-white p-0.5" />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-none text-white">TRUST HUB</span>
                <span className="text-xs tracking-wider uppercase font-semibold text-primary">Business Solutions</span>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Upscale, trusted business solutions provider in Saudi Arabia. We deliver professional confidence for your most important business decisions.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="link-social-linkedin">
                <Linkedin size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="link-social-twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="link-social-instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="link-social-whatsapp">
                <Phone size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-white/70 hover:text-primary transition-colors text-sm" data-testid="link-footer-home">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-primary transition-colors text-sm" data-testid="link-footer-about">About Us</Link>
              </li>
              <li>
                <Link href="/services" className="text-white/70 hover:text-primary transition-colors text-sm" data-testid="link-footer-services">Our Services</Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-primary transition-colors text-sm" data-testid="link-footer-contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-white">Services</h3>
            <ul className="space-y-4">
              <li className="text-white/70 text-sm">Business Setup & Licensing</li>
              <li className="text-white/70 text-sm">PRO Services</li>
              <li className="text-white/70 text-sm">HR & Payroll Solutions</li>
              <li className="text-white/70 text-sm">Accounting & Tax</li>
              <li className="text-white/70 text-sm">Business Consultancy</li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-white">Contact Info</h3>
            <ul className="space-y-4">
              <li className="text-white/70 text-sm flex items-start gap-3">
                <span className="text-primary font-bold mt-0.5">A.</span>
                <span>King Fahd Road, Olaya District<br/>Riyadh, Saudi Arabia</span>
              </li>
              <li className="text-white/70 text-sm flex items-center gap-3">
                <span className="text-primary font-bold">P.</span>
                <span>+966 11 234 5678</span>
              </li>
              <li className="text-white/70 text-sm flex items-center gap-3">
                <span className="text-primary font-bold">E.</span>
                <span>contact@trusthub.com.sa</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm" data-testid="text-copyright">
            &copy; {currentYear} Trust Hub Business Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
