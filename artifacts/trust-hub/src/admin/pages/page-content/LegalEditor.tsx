import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { AdminUpdateLegalContentBody } from "@workspace/api-zod";
import {
  useAdminGetLegalContent,
  useAdminUpdateLegalContent,
  getGetLegalContentQueryKey,
  getAdminGetLegalContentQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

type FormValues = z.infer<typeof AdminUpdateLegalContentBody>;
type Locale = "en" | "ar";

const emptyLocale = () => ({ title: "", lastUpdated: "", body: "" });
const EMPTY_VALUES: FormValues = { en: emptyLocale(), ar: emptyLocale() };

const PAGE_LABEL: Record<string, string> = { privacy: "Privacy Policy", terms: "Terms of Service" };

export function LegalEditor() {
  const params = useParams<{ page: string }>();
  const page = params.page === "terms" ? "terms" : "privacy";
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useAdminGetLegalContent(page);
  const update = useAdminUpdateLegalContent();

  const form = useForm<FormValues>({
    resolver: zodResolver(AdminUpdateLegalContentBody),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  const onSubmit = (formValues: FormValues) => {
    update.mutate(
      { page, data: formValues },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: getGetLegalContentQueryKey(page) });
          void queryClient.invalidateQueries({ queryKey: getAdminGetLegalContentQueryKey(page) });
          toast({ title: `${PAGE_LABEL[page]} updated` });
        },
        onError: () => toast({ title: "Couldn't save changes", variant: "destructive" }),
      },
    );
  };

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (isError || !data) return <p className="text-destructive">Couldn't load {PAGE_LABEL[page]} content.</p>;

  return (
    <div>
      <Link href="/pages" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ChevronLeft size={16} /> Back to Pages
      </Link>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-8">Edit {PAGE_LABEL[page]}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl" noValidate>
          <Tabs defaultValue="en">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            {(["en", "ar"] as Locale[]).map((locale) => {
              const dir = locale === "ar" ? "rtl" : "ltr";
              return (
                <TabsContent key={locale} value={locale} className="space-y-4 mt-4">
                  <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                    <FormField control={form.control} name={`${locale}.title`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl><Input dir={dir} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`${locale}.lastUpdated`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Updated</FormLabel>
                        <FormControl><Input dir={dir} placeholder="e.g. July 2026" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`${locale}.body`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body</FormLabel>
                        <FormControl><Textarea dir={dir} className="min-h-[400px]" {...field} /></FormControl>
                        <FormDescription>Separate paragraphs with a blank line.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="flex gap-3">
            <Button type="submit" disabled={update.isPending} data-testid="button-save-legal">
              {update.isPending ? "Saving…" : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/pages">Cancel</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
