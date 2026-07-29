import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLegalContent, type LegalPage as LegalPageId } from "@workspace/api-client-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import type { Locale } from "@/i18n";

export function LegalPage({ page, path }: { page: LegalPageId; path: string }) {
  const { i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const { data: content, isLoading, isError } = useGetLegalContent(page, { locale });

  useDocumentMeta(content?.title ?? "Trust Hub Business Solutions", content?.title ?? "", path);

  if (isLoading) {
    return (
      <div className="w-full pt-24 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-4">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (isError || !content) {
    return (
      <div className="w-full pt-24 pb-24 text-center">
        <p className="text-muted-foreground">Couldn't load this page right now. Please try again shortly.</p>
      </div>
    );
  }

  return (
    <div className="w-full pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3" data-testid={`text-${page}-title`}>
          {content.title}
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          {locale === "ar" ? "آخر تحديث: " : "Last updated: "}
          {content.lastUpdated}
        </p>
        <div className="prose prose-neutral max-w-none text-foreground prose-headings:font-serif prose-a:text-primary">
          {content.body.split(/\n{2,}/).map((paragraph, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
