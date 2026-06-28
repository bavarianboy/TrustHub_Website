import { useState } from "react";
import { Calendar, Clock, ChevronRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const newsArticles = [
  {
    id: 1,
    category: "Business Setup",
    date: "June 20, 2026",
    readTime: "4 min read",
    title: "New Streamlined Procedures for Foreign Company Registration in Saudi Arabia",
    excerpt:
      "The Ministry of Investment has announced updated fast-track procedures for foreign entities looking to establish a presence in the Kingdom, reducing approval timelines by up to 40%.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    featured: true,
  },
  {
    id: 2,
    category: "Tax & Compliance",
    date: "June 14, 2026",
    readTime: "5 min read",
    title: "ZATCA Expands E-Invoicing Requirements: What Businesses Must Know",
    excerpt:
      "Phase three of Fatoora e-invoicing compliance is now mandatory for a broader category of taxpayers. Trust Hub breaks down the new obligations and deadlines.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=60",
    featured: true,
  },
  {
    id: 3,
    category: "HR & Payroll",
    date: "June 5, 2026",
    readTime: "3 min read",
    title: "Saudization (Nitaqat) Updates: 2026 Quota Changes Across Key Sectors",
    excerpt:
      "Revised Nitaqat band classifications are set to take effect this quarter. We outline which sectors are impacted and how to prepare your workforce strategy.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=60",
    featured: false,
  },
  {
    id: 4,
    category: "Market Insights",
    date: "May 28, 2026",
    readTime: "6 min read",
    title: "Vision 2030 Update: The Sectors Driving Saudi Arabia's Economic Transformation",
    excerpt:
      "From tourism to technology, we review the latest progress across Vision 2030 initiatives and identify the most promising sectors for business entry in 2026.",
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&auto=format&fit=crop&q=60",
    featured: false,
  },
  {
    id: 5,
    category: "Corporate Services",
    date: "May 19, 2026",
    readTime: "4 min read",
    title: "Trust Hub Launches Comprehensive Document Attestation Service",
    excerpt:
      "Our new end-to-end attestation service covers Ministry of Foreign Affairs legalization, embassy attestation, and certified translation — all under one roof.",
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&auto=format&fit=crop&q=60",
    featured: false,
  },
  {
    id: 6,
    category: "Business Consultancy",
    date: "May 10, 2026",
    readTime: "5 min read",
    title: "How to Build a Compliant HR Framework for Your Saudi Operation",
    excerpt:
      "A practical guide to building employment contracts, leave policies, and disciplinary procedures that align with Saudi Labor Law and protect your business.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=60",
    featured: false,
  },
];

const categories = ["All", "Business Setup", "Tax & Compliance", "HR & Payroll", "Market Insights", "Corporate Services", "Business Consultancy"];

export function News() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? newsArticles
      : newsArticles.filter((a) => a.category === activeCategory);

  const featured = filtered.filter((a) => a.featured);
  const regular = filtered.filter((a) => !a.featured);

  return (
    <div className="w-full pt-24">
      {/* Page Header */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6"
              data-testid="text-news-title"
            >
              News & Insights
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              data-testid="text-news-subtitle"
            >
              Stay informed with the latest regulatory updates, market developments, and expert analysis from our team.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border sticky top-[64px] bg-background/95 backdrop-blur-md z-30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-2" data-testid="news-category-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featured.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-8">
              Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map((article) => (
                <article
                  key={article.id}
                  className="group rounded-lg overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300 cursor-pointer"
                  data-testid={`card-news-featured-${article.id}`}
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-0">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                      Read More <ChevronRight size={16} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles */}
      {regular.length > 0 && (
        <section className={`py-16 ${featured.length > 0 ? "bg-secondary" : "bg-background"}`}>
          <div className="container mx-auto px-4 md:px-6">
            {featured.length > 0 && (
              <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-8">
                Latest Articles
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regular.map((article) => (
                <article
                  key={article.id}
                  className="group rounded-lg overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300 cursor-pointer"
                  data-testid={`card-news-${article.id}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-0 text-xs">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                      Read More <ChevronRight size={14} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <section className="py-24 bg-background text-center">
          <div className="container mx-auto px-4 md:px-6">
            <Tag size={40} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No articles in this category yet.</p>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-20 bg-foreground text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Stay Ahead of Regulatory Changes
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
            Subscribe to our newsletter and receive expert updates on Saudi business regulations, market developments, and Trust Hub news directly to your inbox.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary"
              data-testid="input-newsletter-email"
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm px-6 whitespace-nowrap"
              data-testid="button-newsletter-subscribe"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
