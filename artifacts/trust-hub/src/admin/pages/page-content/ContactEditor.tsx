import { useEffect } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { AdminUpdateContactContentBody } from "@workspace/api-zod";
import {
  useAdminGetContactContent,
  useAdminUpdateContactContent,
  getGetContactContentQueryKey,
  getAdminGetContactContentQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

type FormValues = z.infer<typeof AdminUpdateContactContentBody>;
type Locale = "en" | "ar";

const emptyFields = () => ({
  name: "",
  namePlaceholder: "",
  company: "",
  companyPlaceholder: "",
  email: "",
  emailPlaceholder: "",
  phone: "",
  phonePlaceholder: "",
  service: "",
  servicePlaceholder: "",
  message: "",
  messagePlaceholder: "",
});
const emptyLocale = () => ({
  title: "",
  subtitle: "",
  infoHeading: "",
  headOfficeLabel: "",
  addressLine1: "",
  addressLine2: "",
  phoneLabel: "",
  phoneValue: "",
  emailLabel: "",
  emailValue: "",
  businessHoursLabel: "",
  businessHoursValue: "",
  supportHeading: "",
  supportParagraph: "",
  formHeading: "",
  fields: emptyFields(),
  serviceOptions: [] as string[],
  submitButton: "",
  submitting: "",
  toastSuccessTitle: "",
  toastSuccessDescription: "",
  toastErrorTitle: "",
  toastErrorDescription: "",
  socialLinks: [] as { name: string; label: string; href: string }[],
});
// Real empty-string defaults (not an empty {}) so every <Input> is controlled
// from its first render — form.reset(data) then swaps them for the loaded
// content once it arrives, string to string, with no uncontrolled interlude.
const EMPTY_VALUES: FormValues = { en: emptyLocale(), ar: emptyLocale() };

const emptySocialLink = () => ({ name: "", label: "", href: "" });

export function ContactEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useAdminGetContactContent();
  const update = useAdminUpdateContactContent();

  const form = useForm<FormValues>({
    resolver: zodResolver(AdminUpdateContactContentBody),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  // Social links are the same in both languages — a URL doesn't change by
  // locale — so they're edited once here rather than per-locale-tab, and
  // mirrored into both en/ar payloads on submit.
  const socialLinks = form.watch("en.socialLinks") ?? [];
  const addSocialLink = () => form.setValue("en.socialLinks", [...socialLinks, emptySocialLink()]);
  const removeSocialLink = (idx: number) =>
    form.setValue("en.socialLinks", socialLinks.filter((_, i) => i !== idx));

  const onSubmit = (formValues: FormValues) => {
    const payload: FormValues = {
      ...formValues,
      ar: { ...formValues.ar, socialLinks: formValues.en.socialLinks },
    };
    update.mutate(
      { data: payload },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: getGetContactContentQueryKey() });
          void queryClient.invalidateQueries({ queryKey: getAdminGetContactContentQueryKey() });
          toast({ title: "Contact page updated" });
        },
        onError: () => toast({ title: "Couldn't save changes", variant: "destructive" }),
      },
    );
  };

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (isError || !data) return <p className="text-destructive">Couldn't load Contact content.</p>;

  return (
    <div>
      <Link href="/pages" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ChevronLeft size={16} /> Back to Pages
      </Link>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-8">Edit Contact Page</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl" noValidate>
          {/* Social links — locale-independent, edited once */}
          <div className="bg-background border border-border rounded-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Social Links</h2>
                <p className="text-xs text-muted-foreground mt-1">Shown in the footer on every page, in both languages.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addSocialLink} data-testid="button-add-social-link">
                <Plus size={14} className="me-1" /> Add
              </Button>
            </div>
            {socialLinks.map((_, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-3 items-end">
                <FormField control={form.control} name={`en.socialLinks.${idx}.name`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key</FormLabel>
                    <FormControl><Input dir="ltr" placeholder="facebook" {...field} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`en.socialLinks.${idx}.label`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl><Input dir="ltr" placeholder="Facebook" {...field} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`en.socialLinks.${idx}.href`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl><Input dir="ltr" placeholder="https://…" {...field} /></FormControl>
                  </FormItem>
                )} />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive mb-0.5"
                  onClick={() => removeSocialLink(idx)}
                  data-testid={`button-remove-social-link-${idx}`}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">
              Key controls which icon is shown — use one of: facebook, linkedin, youtube, tiktok, instagram. Any
              other key falls back to a generic share icon.
            </p>
          </div>

          <Tabs defaultValue="en">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            {(["en", "ar"] as Locale[]).map((locale) => {
              const dir = locale === "ar" ? "rtl" : "ltr";
              return (
                <TabsContent key={locale} value={locale} className="space-y-6 mt-4">
                  <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                    <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Header</h2>
                    <FormField control={form.control} name={`${locale}.title`} render={({ field }) => (
                      <FormItem><FormLabel>Page Title</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`${locale}.subtitle`} render={({ field }) => (
                      <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea dir={dir} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                    <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Contact Info Card</h2>
                    <FormField control={form.control} name={`${locale}.infoHeading`} render={({ field }) => (
                      <FormItem><FormLabel>Section Heading</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={`${locale}.headOfficeLabel`} render={({ field }) => (
                      <FormItem><FormLabel>Address Block Label</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name={`${locale}.addressLine1`} render={({ field }) => (
                        <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.addressLine2`} render={({ field }) => (
                        <FormItem><FormLabel>Address Line 2</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.phoneLabel`} render={({ field }) => (
                        <FormItem><FormLabel>Phone Label</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.phoneValue`} render={({ field }) => (
                        <FormItem><FormLabel>Phone Value</FormLabel><FormControl><Input dir="ltr" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.emailLabel`} render={({ field }) => (
                        <FormItem><FormLabel>Email Label</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.emailValue`} render={({ field }) => (
                        <FormItem><FormLabel>Email Value</FormLabel><FormControl><Input dir="ltr" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.businessHoursLabel`} render={({ field }) => (
                        <FormItem><FormLabel>Business Hours Label</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.businessHoursValue`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Hours Value</FormLabel>
                          <FormControl>
                            <Textarea dir={dir} {...field} />
                          </FormControl>
                          <FormDescription>Line breaks are preserved.</FormDescription>
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                    <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Dedicated Support Box</h2>
                    <FormField control={form.control} name={`${locale}.supportHeading`} render={({ field }) => (
                      <FormItem><FormLabel>Heading</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={`${locale}.supportParagraph`} render={({ field }) => (
                      <FormItem><FormLabel>Paragraph</FormLabel><FormControl><Textarea dir={dir} {...field} /></FormControl></FormItem>
                    )} />
                  </div>

                  <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                    <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Form</h2>
                    <FormField control={form.control} name={`${locale}.formHeading`} render={({ field }) => (
                      <FormItem><FormLabel>Form Heading</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name={`${locale}.fields.name`} render={({ field }) => (
                        <FormItem><FormLabel>Name Field Label</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.fields.namePlaceholder`} render={({ field }) => (
                        <FormItem><FormLabel>Name Placeholder</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.fields.company`} render={({ field }) => (
                        <FormItem><FormLabel>Company Field Label</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.fields.companyPlaceholder`} render={({ field }) => (
                        <FormItem><FormLabel>Company Placeholder</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.fields.email`} render={({ field }) => (
                        <FormItem><FormLabel>Email Field Label</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.fields.emailPlaceholder`} render={({ field }) => (
                        <FormItem><FormLabel>Email Placeholder</FormLabel><FormControl><Input dir="ltr" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.fields.phone`} render={({ field }) => (
                        <FormItem><FormLabel>Phone Field Label</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.fields.phonePlaceholder`} render={({ field }) => (
                        <FormItem><FormLabel>Phone Placeholder</FormLabel><FormControl><Input dir="ltr" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.fields.service`} render={({ field }) => (
                        <FormItem><FormLabel>Service Field Label</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.fields.servicePlaceholder`} render={({ field }) => (
                        <FormItem><FormLabel>Service Placeholder</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.fields.message`} render={({ field }) => (
                        <FormItem><FormLabel>Message Field Label</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.fields.messagePlaceholder`} render={({ field }) => (
                        <FormItem><FormLabel>Message Placeholder</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                    <FormField
                      control={form.control}
                      name={`${locale}.serviceOptions`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Dropdown Options (one per line)</FormLabel>
                          <FormControl>
                            <Textarea
                              dir={dir}
                              className="min-h-[120px]"
                              value={(field.value ?? []).join("\n")}
                              onChange={(e) => field.onChange(e.target.value.split("\n"))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name={`${locale}.submitButton`} render={({ field }) => (
                        <FormItem><FormLabel>Submit Button Label</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`${locale}.submitting`} render={({ field }) => (
                        <FormItem><FormLabel>Submitting Label</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="bg-background border border-border rounded-sm p-6 space-y-4">
                    <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Submission Messages</h2>
                    <FormField control={form.control} name={`${locale}.toastSuccessTitle`} render={({ field }) => (
                      <FormItem><FormLabel>Success Toast Title</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={`${locale}.toastSuccessDescription`} render={({ field }) => (
                      <FormItem><FormLabel>Success Toast Description</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={`${locale}.toastErrorTitle`} render={({ field }) => (
                      <FormItem><FormLabel>Error Toast Title</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={`${locale}.toastErrorDescription`} render={({ field }) => (
                      <FormItem><FormLabel>Error Toast Description</FormLabel><FormControl><Input dir={dir} {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="flex gap-3">
            <Button type="submit" disabled={update.isPending} data-testid="button-save-contact">
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
