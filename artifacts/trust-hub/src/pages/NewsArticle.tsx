import { useParams, Link } from "wouter";
import { Calendar, ChevronLeft, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetArticleBySlug } from "@workspace/api-client-react";
import fallbackImage from "@/assets/images/luxury-abstract.png";

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function NewsArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError } = useGetArticleBySlug(slug ?? "", { locale: "en" });

  if (isLoading) {
    return (
      <div className="w-full pt-24 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="w-full pt-24 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center py-16">
          <AlertCircle size={40} className="mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Article not found</h1>
          <p className="text-muted-foreground mb-8">
            This article may have been unpublished or the link is incorrect.
          </p>
          <Button asChild variant="outline">
            <Link href="/news" data-testid="link-back-to-news">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to News
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const date = formatDate(article.publishedAt);

  return (
    <div className="w-full pt-24 pb-24">
      <article className="container mx-auto px-4 md:px-6 max-w-3xl">
        <Link
          href="/news"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          data-testid="link-back-to-news"
        >
          <ChevronLeft size={16} /> Back to News
        </Link>

        <Badge className="bg-primary text-primary-foreground border-0 mb-4" data-testid="text-article-category">
          {article.category}
        </Badge>

        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 leading-tight"
          data-testid="text-article-title"
        >
          {article.title}
        </h1>

        {date && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
            <Calendar size={14} />
            {date}
          </div>
        )}

        {article.coverImage && (
          <div className="rounded-lg overflow-hidden mb-10 border border-border">
            <img src={article.coverImage} alt={article.title} className="w-full h-auto object-cover" />
          </div>
        )}
        {!article.coverImage && (
          <div className="rounded-lg overflow-hidden mb-10 border border-border">
            <img src={fallbackImage} alt="" className="w-full h-auto object-cover" />
          </div>
        )}

        <div
          className="prose prose-neutral max-w-none text-foreground prose-headings:font-serif prose-a:text-primary"
          data-testid="text-article-body"
        >
          {article.body.split(/\n{2,}/).map((paragraph, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
