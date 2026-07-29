// One-time migration: moves Contact page content (and site-wide social
// links, edited from the same admin screen) out of the static i18n locale
// files and into the page_content table. Run once, then edit through
// /admin/pages/contact, not by re-running this script.
import { eq, and } from "drizzle-orm";
import { db, pageContentTable, pool } from "@workspace/db";

// Same links wired into the footer — kept in sync here so the admin editor's
// first load matches what's already live. Identical in both locales.
const socialLinks = [
  { name: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61574832492270" },
  { name: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/110359095" },
  { name: "youtube", label: "YouTube", href: "https://www.youtube.com/@TrustHubSA" },
  { name: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@trusthub.ksa" },
  { name: "instagram", label: "Instagram", href: "https://www.instagram.com/trust_hub_sa" },
];

const content = {
  en: {
    title: "Get in Touch",
    subtitle: "Reach out to our executive team to discuss how Trust Hub can support your business objectives in Saudi Arabia.",
    infoHeading: "Contact Information",
    headOfficeLabel: "Head Office",
    addressLine1: "6759 Al Farazdaq St, Ad Dhubbat, RCTA6759",
    addressLine2: "Riyadh 12627, Saudi Arabia",
    phoneLabel: "Phone",
    phoneValue: "+966 54 911 0014",
    emailLabel: "Email",
    emailValue: "advisor@trusthub.com.sa",
    businessHoursLabel: "Business Hours",
    businessHoursValue: "Sunday - Thursday\n8:00 AM - 5:00 PM",
    supportHeading: "Dedicated Support",
    supportParagraph: "Existing clients have access to our 24/7 dedicated support line. Please refer to your client portal for the emergency contact number.",
    formHeading: "Send us a Message",
    fields: {
      name: "Full Name",
      namePlaceholder: "John Doe",
      company: "Company Name",
      companyPlaceholder: "Acme Corp",
      email: "Email Address",
      emailPlaceholder: "john@example.com",
      phone: "Phone Number",
      phonePlaceholder: "+966 5X XXX XXXX",
      service: "Service of Interest",
      servicePlaceholder: "Select a service",
      message: "Your Message",
      messagePlaceholder: "How can we help you?",
    },
    serviceOptions: [
      "Business Setup & Licensing",
      "PRO Services",
      "HR & Payroll Solutions",
      "Accounting & Tax Compliance",
      "Business Consultancy",
      "Other / General Inquiry",
    ],
    submitButton: "Send Message",
    submitting: "Processing...",
    toastSuccessTitle: "Message Sent Successfully",
    toastSuccessDescription: "An advisor will contact you shortly.",
    toastErrorTitle: "Something went wrong",
    toastErrorDescription: "We couldn't send your message. Please try again or call us directly.",
    socialLinks,
  },
  ar: {
    title: "تواصل معنا",
    subtitle: "تواصلوا مع فريقنا التنفيذي لمناقشة كيف يمكن لترست هب دعم أهدافكم التجارية في المملكة العربية السعودية.",
    infoHeading: "معلومات التواصل",
    headOfficeLabel: "المكتب الرئيسي",
    addressLine1: "6759 شارع الفرزدق، حي الضباط، RCTA6759",
    addressLine2: "الرياض 12627، المملكة العربية السعودية",
    phoneLabel: "الهاتف",
    phoneValue: "+966 54 911 0014",
    emailLabel: "البريد الإلكتروني",
    emailValue: "advisor@trusthub.com.sa",
    businessHoursLabel: "ساعات العمل",
    businessHoursValue: "الأحد - الخميس\n8:00 صباحًا - 5:00 مساءً",
    supportHeading: "دعم مخصص",
    supportParagraph: "يتمتع عملاؤنا الحاليون بإمكانية الوصول إلى خط دعمنا المخصص على مدار الساعة. يُرجى الرجوع إلى بوابة العملاء للحصول على رقم التواصل في حالات الطوارئ.",
    formHeading: "أرسلوا لنا رسالة",
    fields: {
      name: "الاسم الكامل",
      namePlaceholder: "محمد أحمد",
      company: "اسم الشركة",
      companyPlaceholder: "شركة نموذجية",
      email: "البريد الإلكتروني",
      emailPlaceholder: "example@domain.com",
      phone: "رقم الهاتف",
      phonePlaceholder: "+966 5X XXX XXXX",
      service: "الخدمة المطلوبة",
      servicePlaceholder: "اختر خدمة",
      message: "رسالتكم",
      messagePlaceholder: "كيف يمكننا مساعدتكم؟",
    },
    serviceOptions: [
      "تأسيس الشركات والتراخيص",
      "الخدمات الحكومية (PRO)",
      "حلول الموارد البشرية والرواتب",
      "المحاسبة والامتثال الضريبي",
      "الاستشارات التجارية",
      "استفسار عام / أخرى",
    ],
    submitButton: "إرسال الرسالة",
    submitting: "جارٍ الإرسال...",
    toastSuccessTitle: "تم إرسال رسالتكم بنجاح",
    toastSuccessDescription: "سيتواصل معكم أحد مستشارينا قريبًا.",
    toastErrorTitle: "حدث خطأ ما",
    toastErrorDescription: "تعذّر إرسال رسالتكم. يُرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.",
    socialLinks,
  },
} as const;

for (const locale of ["en", "ar"] as const) {
  const value = content[locale];

  const [existing] = await db
    .select({ id: pageContentTable.id })
    .from(pageContentTable)
    .where(and(eq(pageContentTable.page, "contact"), eq(pageContentTable.locale, locale)))
    .limit(1);

  if (existing) {
    await db.update(pageContentTable).set({ content: value, updatedAt: new Date() }).where(eq(pageContentTable.id, existing.id));
    console.log(`Updated contact/${locale}`);
  } else {
    await db.insert(pageContentTable).values({ page: "contact", locale, content: value });
    console.log(`Inserted contact/${locale}`);
  }
}

await pool.end();
