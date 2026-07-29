import { useEffect } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { AdminUpdateWorkspaceContentBody } from "@workspace/api-zod";
import {
  useAdminGetWorkspaceContent,
  useAdminUpdateWorkspaceContent,
  getGetWorkspaceContentQueryKey,
  getAdminGetWorkspaceContentQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSyncedArray } from "./useSyncedArray";

type FormValues = z.infer<typeof AdminUpdateWorkspaceContentBody>;
type Locale = "en" | "ar";

const emptyType = () => ({ name: "", tagline: "", description: "", features: [] as string[], price: "" });
const emptyFaq = () => ({ q: "", a: "" });
const emptyLocale = () => ({
  title: "",
  subtitle: "",
  bookTour: "",
  enquireNow: "",
  offerEyebrow: "",
  offerHeading: "",
  getQuote: "",
  types: [] as ReturnType<typeof emptyType>[],
  amenitiesEyebrow: "",
  amenitiesHeading: "",
  amenities: [] as string[],
  locationEyebrow: "",
  locationHeading: "",
  locationParagraph: "",
  addressLabel: "",
  addressValue: "",
  hoursLabel: "",
  hoursValue: "",
  phoneLabel: "",
  phoneValue: "",
  emailLabel: "",
  emailValue: "",
  mapPlaceholder: "",
  mapAddress: "",
  faqEyebrow: "",
  faqHeading: "",
  faqs: [] as ReturnType<typeof emptyFaq>[],
  ctaHeading: "",
  ctaParagraph: "",
  ctaButton: "",
});
// Real empty-string defaults (not an empty {}) so every <Input> is controlled
// from its first render — form.reset(data) then swaps them for the loaded
// content once it arrives, string to string, with no uncontrolled interlude.
const EMPTY_VALUES: FormValues = { en: emptyLocale(), ar: emptyLocale() };

// Simple string fields (Field alone, no textarea multi-line by default).
function TextField({ form, name, label, dir }: { form: ReturnType<typeof useForm<FormValues>>; name: string; label: string; dir: "rtl" | "ltr" }) {
  return (
    <FormField
      control={form.control}
      name={name as never}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl><Input dir={dir} {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function WorkspaceEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useAdminGetWorkspaceContent();
  const update = useAdminUpdateWorkspaceContent();

  const form = useForm<FormValues>({
    resolver: zodResolver(AdminUpdateWorkspaceContentBody),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  const types = useSyncedArray(form, "en.types", "ar.types", emptyType);
  const faqs = useSyncedArray(form, "en.faqs", "ar.faqs", emptyFaq);

  const onSubmit = (formValues: FormValues) => {
    update.mutate(
      { data: formValues },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: getGetWorkspaceContentQueryKey() });
          void queryClient.invalidateQueries({ queryKey: getAdminGetWorkspaceContentQueryKey() });
          toast({ title: "Workspace page updated" });
        },
        onError: () => toast({ title: "Couldn't save changes", variant: "destructive" }),
      },
    );
  };

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (isError || !data) return <p className="text-destructive">Couldn't load Workspace content.</p>;

  return (
    <div>
      <Link href="/pages" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ChevronLeft size={16} /> Back to Pages
      </Link>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-8">Edit Workspace Page</h1>

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
                <TabsContent key={locale} value={locale} className="space-y-6 mt-4">
                  {/* Header */}
                  <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                    <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Header</h2>
                    <TextField form={form} name={`${locale}.title`} label="Page Title" dir={dir} />
                    <FormField control={form.control} name={`${locale}.subtitle`} render={({ field }) => (
                      <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea dir={dir} {...field} /></FormControl></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <TextField form={form} name={`${locale}.bookTour`} label={`"Book a Tour" Button`} dir={dir} />
                      <TextField form={form} name={`${locale}.enquireNow`} label={`"Enquire Now" Button`} dir={dir} />
                    </div>
                  </div>

                  {/* Workspace types */}
                  <div className="space-y-4">
                    <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                      <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Workspace Types Section</h2>
                      <TextField form={form} name={`${locale}.offerEyebrow`} label="Eyebrow" dir={dir} />
                      <TextField form={form} name={`${locale}.offerHeading`} label="Heading" dir={dir} />
                      <TextField form={form} name={`${locale}.getQuote`} label={`"Get a Quote" Button`} dir={dir} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Workspace Type Cards</span>
                      <Button type="button" variant="outline" size="sm" onClick={types.add} data-testid="button-add-type">
                        <Plus size={14} className="me-1" /> Add
                      </Button>
                    </div>
                    {types.items.map((_, idx) => (
                      <div key={idx} className="bg-background border border-border rounded-sm p-6 space-y-4 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-3 end-3 text-destructive hover:text-destructive" onClick={() => types.remove(idx)} data-testid={`button-remove-type-${idx}`}>
                          <Trash2 size={14} />
                        </Button>
                        <TextField form={form} name={`${locale}.types.${idx}.name`} label="Name" dir={dir} />
                        <TextField form={form} name={`${locale}.types.${idx}.tagline`} label="Tagline" dir={dir} />
                        <FormField control={form.control} name={`${locale}.types.${idx}.description`} render={({ field }) => (
                          <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea dir={dir} {...field} /></FormControl></FormItem>
                        )} />
                        <FormField
                          control={form.control}
                          name={`${locale}.types.${idx}.features`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Features (one per line)</FormLabel>
                              <FormControl>
                                <Textarea dir={dir} value={(field.value ?? []).join("\n")} onChange={(e) => field.onChange(e.target.value.split("\n"))} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <TextField form={form} name={`${locale}.types.${idx}.price`} label="Price" dir={dir} />
                      </div>
                    ))}
                  </div>

                  {/* Amenities */}
                  <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                    <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Amenities Section</h2>
                    <TextField form={form} name={`${locale}.amenitiesEyebrow`} label="Eyebrow" dir={dir} />
                    <TextField form={form} name={`${locale}.amenitiesHeading`} label="Heading" dir={dir} />
                    <FormField
                      control={form.control}
                      name={`${locale}.amenities`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amenities (one per line)</FormLabel>
                          <FormControl>
                            <Textarea dir={dir} className="min-h-[140px]" value={(field.value ?? []).join("\n")} onChange={(e) => field.onChange(e.target.value.split("\n"))} />
                          </FormControl>
                          <FormDescription>
                            Keep the same number of lines, in the same order, in both English and Arabic — each line is paired with an icon by position.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location */}
                  <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                    <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Location Section</h2>
                    <TextField form={form} name={`${locale}.locationEyebrow`} label="Eyebrow" dir={dir} />
                    <TextField form={form} name={`${locale}.locationHeading`} label="Heading" dir={dir} />
                    <FormField control={form.control} name={`${locale}.locationParagraph`} render={({ field }) => (
                      <FormItem><FormLabel>Paragraph</FormLabel><FormControl><Textarea dir={dir} {...field} /></FormControl></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <TextField form={form} name={`${locale}.addressLabel`} label="Address Label" dir={dir} />
                      <TextField form={form} name={`${locale}.addressValue`} label="Address Value" dir={dir} />
                      <TextField form={form} name={`${locale}.hoursLabel`} label="Hours Label" dir={dir} />
                      <TextField form={form} name={`${locale}.hoursValue`} label="Hours Value" dir={dir} />
                      <TextField form={form} name={`${locale}.phoneLabel`} label="Phone Label" dir={dir} />
                      <TextField form={form} name={`${locale}.phoneValue`} label="Phone Value" dir="ltr" />
                      <TextField form={form} name={`${locale}.emailLabel`} label="Email Label" dir={dir} />
                      <TextField form={form} name={`${locale}.emailValue`} label="Email Value" dir="ltr" />
                    </div>
                    <TextField form={form} name={`${locale}.mapPlaceholder`} label="Map Placeholder Text" dir={dir} />
                    <TextField form={form} name={`${locale}.mapAddress`} label="Map Address Line" dir={dir} />
                  </div>

                  {/* FAQ */}
                  <div className="space-y-4">
                    <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                      <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">FAQ Section</h2>
                      <TextField form={form} name={`${locale}.faqEyebrow`} label="Eyebrow" dir={dir} />
                      <TextField form={form} name={`${locale}.faqHeading`} label="Heading" dir={dir} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">FAQs</span>
                      <Button type="button" variant="outline" size="sm" onClick={faqs.add} data-testid="button-add-faq">
                        <Plus size={14} className="me-1" /> Add
                      </Button>
                    </div>
                    {faqs.items.map((_, idx) => (
                      <div key={idx} className="bg-background border border-border rounded-sm p-6 space-y-4 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-3 end-3 text-destructive hover:text-destructive" onClick={() => faqs.remove(idx)} data-testid={`button-remove-faq-${idx}`}>
                          <Trash2 size={14} />
                        </Button>
                        <TextField form={form} name={`${locale}.faqs.${idx}.q`} label="Question" dir={dir} />
                        <FormField control={form.control} name={`${locale}.faqs.${idx}.a`} render={({ field }) => (
                          <FormItem><FormLabel>Answer</FormLabel><FormControl><Textarea dir={dir} {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                    <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Closing CTA</h2>
                    <TextField form={form} name={`${locale}.ctaHeading`} label="Heading" dir={dir} />
                    <FormField control={form.control} name={`${locale}.ctaParagraph`} render={({ field }) => (
                      <FormItem><FormLabel>Paragraph</FormLabel><FormControl><Textarea dir={dir} {...field} /></FormControl></FormItem>
                    )} />
                    <TextField form={form} name={`${locale}.ctaButton`} label="Button Label" dir={dir} />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="flex gap-3">
            <Button type="submit" disabled={update.isPending} data-testid="button-save-workspace">
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
