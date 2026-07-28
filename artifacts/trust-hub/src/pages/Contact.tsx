import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateLeadBody } from "@workspace/api-zod";
import { useCreateLead } from "@workspace/api-client-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import type { Locale } from "@/i18n";

// website is a honeypot: never shown to real visitors, so any value submitted
// through it means the form was filled in by a bot, not a person.
const contactFormSchema = CreateLeadBody.omit({ locale: true });
type ContactFormValues = z.infer<typeof contactFormSchema>;

export function Contact() {
  const { t, i18n } = useTranslation();
  useDocumentMeta(t("contact.title"), t("contact.subtitle"), "/contact");
  const { toast } = useToast();
  const createLead = useCreateLead();
  const serviceOptions = t("contact.serviceOptions", { returnObjects: true }) as string[];

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = (values: ContactFormValues) => {
    createLead.mutate(
      { data: { ...values, locale: i18n.language as Locale } },
      {
        onSuccess: () => {
          toast({
            title: t("contact.toastSuccessTitle"),
            description: t("contact.toastSuccessDescription"),
          });
          form.reset();
        },
        onError: () => {
          toast({
            title: t("contact.toastErrorTitle"),
            description: t("contact.toastErrorDescription"),
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="w-full pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-6">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6" data-testid="text-contact-title">
            {t("contact.title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* Contact Information */}
          <div className="lg:w-1/3 space-y-10">
            <div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-6">{t("contact.infoHeading")}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{t("contact.headOffice")}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                      {t("contact.headOfficeAddress")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{t("contact.phone")}</h4>
                    <p className="text-muted-foreground text-sm whitespace-pre-line" dir="ltr">
                      {t("contact.phoneNumbers")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{t("contact.email")}</h4>
                    <p className="text-muted-foreground text-sm whitespace-pre-line" dir="ltr">
                      {t("contact.emailAddresses")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{t("contact.businessHours")}</h4>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">
                      {t("contact.businessHoursValue")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-foreground text-white rounded-sm">
              <h4 className="font-serif font-bold text-xl mb-4">{t("contact.supportHeading")}</h4>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {t("contact.supportParagraph")}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3">
            <div className="bg-background border border-border rounded-sm shadow-xl p-8 md:p-12">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-8">{t("contact.formHeading")}</h3>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.fields.name")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("contact.fields.namePlaceholder")}
                              className="bg-secondary/50 focus-visible:ring-primary"
                              data-testid="input-contact-name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.fields.company")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("contact.fields.companyPlaceholder")}
                              className="bg-secondary/50 focus-visible:ring-primary"
                              data-testid="input-contact-company"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.fields.email")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t("contact.fields.emailPlaceholder")}
                              className="bg-secondary/50 focus-visible:ring-primary"
                              data-testid="input-contact-email"
                              dir="ltr"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.fields.phone")}</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder={t("contact.fields.phonePlaceholder")}
                              className="bg-secondary/50 focus-visible:ring-primary"
                              data-testid="input-contact-phone"
                              dir="ltr"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.fields.service")}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-secondary/50 focus:ring-primary" data-testid="select-contact-service">
                              <SelectValue placeholder={t("contact.fields.servicePlaceholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {serviceOptions.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.fields.message")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("contact.fields.messagePlaceholder")}
                            className="min-h-[150px] bg-secondary/50 focus-visible:ring-primary resize-none"
                            data-testid="input-contact-message"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Honeypot: hidden from real visitors via CSS + tabIndex, not
                      `type="hidden"`, so bots that autofill visible-looking
                      inputs still trip it. */}
                  <div className="absolute -start-[9999px]" aria-hidden="true">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <Input tabIndex={-1} autoComplete="off" {...field} />
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold"
                    disabled={createLead.isPending}
                    data-testid="button-contact-submit"
                  >
                    {createLead.isPending ? (
                      <span className="flex items-center gap-2">{t("contact.submitting")}</span>
                    ) : (
                      <span className="flex items-center gap-2">{t("contact.submitButton")} <Send className="w-4 h-4 rtl:-scale-x-100" /></span>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
