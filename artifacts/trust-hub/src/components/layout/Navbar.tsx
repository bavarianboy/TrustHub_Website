import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/pro_180_1782647507368.jpg";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "News", path: "/news" },
    { name: "Workspace", path: "/workspace" },
    { name: "Contact", path: "/contact" },
  ];

  const useDarkText = isScrolled || !isHomePage;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useDarkText
          ? "bg-background/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 z-50" data-testid="link-logo">
          <img src={logoPath} alt="Trust Hub Logo" className="h-12 w-12 rounded-full object-cover shadow-sm" />
          <div className="flex flex-col">
            <span className={`font-serif font-bold text-lg leading-none ${useDarkText ? "text-foreground" : "text-white"}`}>
              TRUST HUB
            </span>
            <span className={`text-[10px] tracking-wider uppercase font-semibold ${useDarkText ? "text-muted-foreground" : "text-white/80"}`}>
              Business Solutions
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.path
                      ? "text-primary"
                      : useDarkText
                      ? "text-foreground"
                      : "text-white/90"
                  }`}
                  data-testid={`link-nav-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-sm px-6"
            asChild
          >
            <Link href="/contact" data-testid="button-get-started">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden z-50 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className={useDarkText || mobileMenuOpen ? "text-foreground" : "text-white"} />
          ) : (
            <Menu className={useDarkText ? "text-foreground" : "text-white"} />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-background/98 backdrop-blur-xl z-40 flex flex-col items-center justify-center transition-all duration-300 ${
            mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <ul className="flex flex-col items-center gap-8 text-xl">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`font-medium transition-colors hover:text-primary ${
                    location === link.path ? "text-primary" : "text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-nav-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Button
            className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-sm px-8 py-6 text-lg"
            asChild
            onClick={() => setMobileMenuOpen(false)}
          >
            <Link href="/contact" data-testid="button-mobile-get-started">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
