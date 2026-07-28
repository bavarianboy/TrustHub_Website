import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminListArticles, useAdminDeleteArticle, getAdminListArticlesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function ArticlesList() {
  const queryClient = useQueryClient();
  const { data: articles, isLoading, isError } = useAdminListArticles();
  const deleteArticle = useAdminDeleteArticle();

  const sorted = [...(articles ?? [])].sort((a, b) => {
    const aDate = a.publishedAt ?? "";
    const bDate = b.publishedAt ?? "";
    return bDate.localeCompare(aDate);
  });

  const handleDelete = (id: string) => {
    deleteArticle.mutate(
      { id },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: getAdminListArticlesQueryKey() });
        },
      },
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Articles</h1>
          <p className="text-muted-foreground text-sm">News content shown on the public site, in English and Arabic.</p>
        </div>
        <Button asChild data-testid="button-new-article">
          <Link href="/articles/new">
            <Plus size={16} className="me-2" />
            New Article
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {isError && <p className="text-destructive">Couldn't load articles. You may need to log in again.</p>}

      {!isLoading && !isError && sorted.length === 0 && (
        <p className="text-muted-foreground text-center py-16">No articles yet. Create the first one.</p>
      )}

      {!isLoading && !isError && sorted.length > 0 && (
        <div className="bg-background border border-border rounded-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title (EN)</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Translations</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((article) => {
                const enTitle = article.translations.find((t) => t.locale === "en")?.title ?? article.slug;
                const locales = article.translations.map((t) => t.locale);
                return (
                  <TableRow key={article.id} data-testid={`row-article-${article.id}`}>
                    <TableCell className="font-medium">{enTitle}</TableCell>
                    <TableCell className="text-muted-foreground text-sm" dir="ltr">
                      {article.slug}
                    </TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>
                      <Badge
                        className={`border-0 capitalize ${
                          article.status === "published" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {(["en", "ar"] as const).map((locale) => (
                          <Badge
                            key={locale}
                            variant="outline"
                            className={locales.includes(locale) ? "" : "opacity-30"}
                          >
                            {locale.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild data-testid={`button-edit-article-${article.id}`}>
                          <Link href={`/articles/${article.id}`}>
                            <Pencil size={16} />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              data-testid={`button-delete-article-${article.id}`}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete "{enTitle}"?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes the article and both its translations. This can't be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDelete(article.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
