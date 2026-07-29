import { useEffect } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { AdminUpdateServicesContentBody } from "@workspace/api-zod";
import {
  useAdminGetServicesContent,
  useAdminUpdateServicesContent,
  getGetServicesContentQueryKey,
  getAdminGetServicesContentQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSyncedArray } from "./useSyncedArray";

type FormValues = z.infer<typeof AdminUpdateServicesContentBody>;
type Locale = "en" | "ar";

let nextId = 1;
const emptyService = () => ({ id: `service-${Date.now()}-${nextId++}`, title: "", description: "", features: [] as string[] });
const emptyLocale = () => ({
  title: "",
  subtitle: "",
  keyCapabilities: "",
  list: [] as ReturnType<typeof emptyService>[],
  ctaHeading: "",
  ctaParagraph: "",
  ctaButton: "",
});
// Real empty-string defaults (not an empty {}) so every <Input> is controlled
// from its first render — form.reset(data) then swaps them for the loaded
// content once it arrives, string to string, with no uncontrolled interlude.
const EMPTY_VALUES: FormValues = { en: emptyLocale(), ar: emptyLocale() };

export function ServicesEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useAdminGetServicesContent();
  const update = useAdminUpdateServicesContent();

  const form = useForm<FormValues>({
    resolver: zodResolver(AdminUpdateServicesContentBody),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  const list = useSyncedArray(form, "en.list", "ar.list", emptyService);

  const onSubmit = (formValues: FormValues) => {
    update.mutate(
      { data: formValues },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: getGetServicesContentQueryKey() });
          void queryClient.invalidateQueries({ queryKey: getAdminGetServicesContentQueryKey() });
          toast({ title: "Services page updated" });
        },
        onError: () => toast({ title: "Couldn't save changes", variant: "destructive" }),
      },
    );
  };

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (isError || !data) return <p className="text-destructive">Couldn't load Services content.</p>;

  return (
    <div>
      <Link href="/pages" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ChevronLeft size={16} /> Back to Pages
      </Link>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-8">Edit Services Page</h1>

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
                  <FormField control={form.control} name={`${locale}.keyCapabilities`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>"Key Capabilities" Label</FormLabel>
                      <FormControl><Input dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Services</span>
                    <Button type="button" variant="outline" size="sm" onClick={list.add} data-testid="button-add-service">
                      <Plus size={14} className="me-1" /> Add Service
                    </Button>
                  </div>
                  {list.items.map((_, idx) => (
                    <div key={idx} className="bg-background border border-border rounded-sm p-6 space-y-4 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 end-3 text-destructive hover:text-destructive"
                        onClick={() => list.remove(idx)}
                        data-testid={`button-remove-service-${idx}`}
                      >
                        <Trash2 size={14} />
                      </Button>
                      <FormField control={form.control} name={`${locale}.list.${idx}.title`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl><Input dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.list.${idx}.description`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl><Textarea dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField
                        control={form.control}
                        name={`${locale}.list.${idx}.features`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Features (one per line)</FormLabel>
                            <FormControl>
                              <Textarea
                                dir={locale === "ar" ? "rtl" : "ltr"}
                                className="min-h-[120px]"
                                value={(field.value ?? []).join("\n")}
                                onChange={(e) => field.onChange(e.target.value.split("\n"))}
                              />
                            </FormControl>
                            <FormDescription>Each line becomes one bullet point on the site.</FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                  <FormField control={form.control} name={`${locale}.ctaHeading`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Heading</FormLabel>
                      <FormControl><Input dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`${locale}.ctaParagraph`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Paragraph</FormLabel>
                      <FormControl><Textarea dir={locale === "ar" ? "rtl" : "ltr"} {...field} /></FormControl>
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
            <Button type="submit" disabled={update.isPending} data-testid="button-save-services">
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
