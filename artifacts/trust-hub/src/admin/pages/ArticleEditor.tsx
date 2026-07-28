import { useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { AdminCreateArticleBody } from "@workspace/api-zod";
import {
  useAdminListArticles,
  useAdminCreateArticle,
  useAdminUpdateArticle,
  getAdminListArticlesQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

type ArticleFormValues = z.infer<typeof AdminCreateArticleBody>;

const EMPTY_VALUES: ArticleFormValues = {
  slug: "",
  category: "",
  coverImage: "",
  featured: false,
  status: "draft",
  translations: [
    { locale: "en", title: "", excerpt: "", body: "" },
    { locale: "ar", title: "", excerpt: "", body: "" },
  ],
};

export function ArticleEditor() {
  const params = useParams<{ id?: string }>();
  const isEditing = Boolean(params.id) && params.id !== "new";
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // No single-article GET endpoint exists on the admin API yet; the article
  // list is small enough that reusing it here avoids adding one.
  const { data: articles } = useAdminListArticles();
  const existing = useMemo(
    () => (isEditing ? articles?.find((a) => a.id === params.id) : undefined),
    [articles, isEditing, params.id],
  );

  const createArticle = useAdminCreateArticle();
  const updateArticle = useAdminUpdateArticle();
  const isSaving = createArticle.isPending || updateArticle.isPending;

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(AdminCreateArticleBody),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!existing) return;
    form.reset({
      slug: existing.slug,
      category: existing.category,
      coverImage: existing.coverImage ?? "",
      featured: existing.featured,
      status: existing.status,
      translations: (["en", "ar"] as const).map((locale) => {
        const t = existing.translations.find((tr) => tr.locale === locale);
        return { locale, title: t?.title ?? "", excerpt: t?.excerpt ?? "", body: t?.body ?? "" };
      }),
    });
  }, [existing, form]);

  const categoryOptions = useMemo(
    () => Array.from(new Set((articles ?? []).map((a) => a.category))),
    [articles],
  );

  const onSubmit = (values: ArticleFormValues) => {
    const payload = { ...values, coverImage: values.coverImage || undefined };
    const onSuccess = () => {
      void queryClient.invalidateQueries({ queryKey: getAdminListArticlesQueryKey() });
      toast({ title: isEditing ? "Article updated" : "Article created" });
      setLocation("/articles");
    };
    const onError = () => {
      toast({ title: "Couldn't save the article", variant: "destructive" });
    };

    if (isEditing && params.id) {
      updateArticle.mutate({ id: params.id, data: payload }, { onSuccess, onError });
    } else {
      createArticle.mutate({ data: payload }, { onSuccess, onError });
    }
  };

  if (isEditing && !existing) {
    return <p className="text-muted-foreground">Loading article…</p>;
  }

  return (
    <div>
      <Link
        href="/articles"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ChevronLeft size={16} /> Back to Articles
      </Link>

      <h1 className="text-2xl font-serif font-bold text-foreground mb-8">
        {isEditing ? "Edit Article" : "New Article"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl" noValidate>
          <div className="bg-background border border-border rounded-sm p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input dir="ltr" placeholder="my-article-slug" data-testid="input-article-slug" {...field} />
                    </FormControl>
                    <FormDescription>Used in the public URL: /news/{field.value || "…"}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input list="category-options" data-testid="input-article-category" {...field} />
                    </FormControl>
                    <datalist id="category-options">
                      {categoryOptions.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input dir="ltr" placeholder="https://…" data-testid="input-article-cover" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-8">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-40">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-article-status">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0 pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-article-featured"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Featured on /news</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-foreground mb-3">Content</h2>
            <Tabs defaultValue="en">
              <TabsList>
                <TabsTrigger value="en" data-testid="tab-locale-en">English</TabsTrigger>
                <TabsTrigger value="ar" data-testid="tab-locale-ar">العربية</TabsTrigger>
              </TabsList>
              {([0, 1] as const).map((idx) => {
                const locale = idx === 0 ? "en" : "ar";
                return (
                  <TabsContent key={locale} value={locale} className="bg-background border border-border rounded-sm p-6 space-y-6 mt-4">
                    <FormField
                      control={form.control}
                      name={`translations.${idx}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input dir={locale === "ar" ? "rtl" : "ltr"} data-testid={`input-article-title-${locale}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`translations.${idx}.excerpt`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea
                              dir={locale === "ar" ? "rtl" : "ltr"}
                              className="min-h-[80px]"
                              data-testid={`input-article-excerpt-${locale}`}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Shown on the News list page.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`translations.${idx}.body`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Body</FormLabel>
                          <FormControl>
                            <Textarea
                              dir={locale === "ar" ? "rtl" : "ltr"}
                              className="min-h-[300px]"
                              data-testid={`input-article-body-${locale}`}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Separate paragraphs with a blank line.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSaving} data-testid="button-save-article">
              {isSaving ? "Saving…" : isEditing ? "Save Changes" : "Create Article"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/articles">Cancel</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
