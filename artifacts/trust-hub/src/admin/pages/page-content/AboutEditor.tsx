import { useEffect } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { AdminUpdateAboutContentBody } from "@workspace/api-zod";
import {
  useAdminGetAboutContent,
  useAdminUpdateAboutContent,
  getGetAboutContentQueryKey,
  getAdminGetAboutContentQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSyncedArray } from "./useSyncedArray";

type FormValues = z.infer<typeof AdminUpdateAboutContentBody>;
type Locale = "en" | "ar";

const emptyValue = () => ({ title: "", desc: "" });
const emptyLocale = () => ({
  title: "",
  subtitle: "",
  legacyHeading: "",
  legacyParagraph1: "",
  legacyParagraph2: "",
  legacyParagraph3: "",
  valuesHeading: "",
  valuesSubtitle: "",
  values: [] as { title: string; desc: string }[],
  ctaHeading: "",
  ctaButton: "",
});
// Real empty-string defaults (not an empty {}) so every <Input> is controlled
// from its first render — form.reset(data) then swaps them for the loaded
// content once it arrives, string to string, with no uncontrolled interlude.
const EMPTY_VALUES: FormValues = { en: emptyLocale(), ar: emptyLocale() };

export function AboutEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useAdminGetAboutContent();
  const update = useAdminUpdateAboutContent();

  const form = useForm<FormValues>({
    resolver: zodResolver(AdminUpdateAboutContentBody),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  const values = useSyncedArray(form, "en.values", "ar.values", emptyValue);

  const onSubmit = (formValues: FormValues) => {
    update.mutate(
      { data: formValues },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: getGetAboutContentQueryKey() });
          void queryClient.invalidateQueries({ queryKey: getAdminGetAboutContentQueryKey() });
          toast({ title: "About page updated" });
        },
        onError: () => toast({ title: "Couldn't save changes", variant: "destructive" }),
      },
    );
  };

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (isError || !data) return <p className="text-destructive">Couldn't load About content.</p>;

  return (
    <div>
      <Link href="/pages" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ChevronLeft size={16} /> Back to Pages
      </Link>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-8">Edit About Page</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl" noValidate>
          <Tabs defaultValue="en">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            {(["en", "ar"] as Locale[]).map((locale) => (
              <TabsContent key={locale} value={locale} className="space-y-6 mt-4">
                <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                  <FormField control={form.control} name={`${locale}.title`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl><Input dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`${locale}.subtitle`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl><Textarea dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                  <FormField control={form.control} name={`${locale}.legacyHeading`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>"Our Story" Heading</FormLabel>
                      <FormControl><Input dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`${locale}.legacyParagraph1`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paragraph 1</FormLabel>
                      <FormControl><Textarea dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-[100px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`${locale}.legacyParagraph2`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paragraph 2</FormLabel>
                      <FormControl><Textarea dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-[100px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`${locale}.legacyParagraph3`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paragraph 3</FormLabel>
                      <FormControl><Textarea dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-[100px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                  <FormField control={form.control} name={`${locale}.valuesHeading`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Values Section Heading</FormLabel>
                      <FormControl><Input dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`${locale}.valuesSubtitle`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Values Section Subtitle</FormLabel>
                      <FormControl><Input dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-foreground">Value Cards</span>
                      <Button type="button" variant="outline" size="sm" onClick={values.add} data-testid="button-add-value">
                        <Plus size={14} className="me-1" /> Add
                      </Button>
                    </div>
                    {values.items.map((_, idx) => (
                      <div key={idx} className="border border-border rounded-sm p-4 space-y-3 relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 end-2 text-destructive hover:text-destructive"
                          onClick={() => values.remove(idx)}
                          data-testid={`button-remove-value-${idx}`}
                        >
                          <Trash2 size={14} />
                        </Button>
                        <FormField control={form.control} name={`${locale}.values.${idx}.title`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`${locale}.values.${idx}.desc`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                          </FormItem>
                        )} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                  <FormField control={form.control} name={`${locale}.ctaHeading`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Heading</FormLabel>
                      <FormControl><Input dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`${locale}.ctaButton`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Button Label</FormLabel>
                      <FormControl><Input dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex gap-3">
            <Button type="submit" disabled={update.isPending} data-testid="button-save-about">
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
