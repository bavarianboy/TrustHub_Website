import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Calendar, ChevronRight, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListArticles, type ArticleSummary } from "@workspace/api-client-react";
import fallbackImage from "@/assets/images/luxury-abstract.png";

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function ArticleCard({ article, featured }: { article: ArticleSummary; featured: boolean }) {
  const date = formatDate(article.publishedAt);

  return (
    <Link href={`/news/${article.slug}`}>
      <article
        className="group rounded-lg overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
        data-testid={`card-news-${article.slug}`}
      >
        <div className={`relative overflow-hidden ${featured ? "h-60" : "h-48"}`}>
          <img
            src={article.coverImage ?? fallbackImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {featured && <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />}
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-0 text-xs">
            {article.category}
          </Badge>
        </div>
        <div className={featured ? "p-6" : "p-5"}>
          {date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <Calendar size={featured ? 12 : 11} />
              {date}
            </div>
          )}
          <h3
            className={`font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug ${
              featured ? "text-xl mb-3" : "text-lg"
            }`}
          >
            {article.title}
          </h3>
          <p className={`text-muted-foreground text-sm leading-relaxed mb-4 ${featured ? "" : "line-clamp-3"}`}>
            {article.excerpt}
          </p>
          <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
            Read More <ChevronRight size={featured ? 16 : 14} />
          </span>
        </div>
      </article>
    </Link>
  );
}

export function News() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: articles, isLoading, isError } = useListArticles({ locale: "en" });

  const categories = useMemo(() => {
    const unique = Array.from(new Set((articles ?? []).map((a) => a.category)));
    return ["All", ...unique];
  }, [articles]);

  const filtered = useMemo(() => {
    if (!articles) return [];
    return activeCategory === "All" ? articles : articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

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
      {categories.length > 1 && (
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
      )}

      {isLoading && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border bg-card">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {isError && (
        <section className="py-24 bg-background text-center">
          <div className="container mx-auto px-4 md:px-6">
            <AlertCircle size={40} className="mx-auto text-destructive mb-4" />
            <p className="text-muted-foreground text-lg">Couldn't load articles right now. Please try again shortly.</p>
          </div>
        </section>
      )}

      {!isLoading && !isError && (
        <>
          {/* Featured Articles */}
          {featured.length > 0 && (
            <section className="py-16 bg-background">
              <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-8">
                  Featured
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featured.map((article) => (
                    <ArticleCard key={article.id} article={article} featured />
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
                    <ArticleCard key={article.id} article={article} featured={false} />
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
        </>
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
