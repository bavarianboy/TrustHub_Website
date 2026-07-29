// One-time seed for Privacy Policy / Terms of Service draft content. This is
// boilerplate written to be a reasonable starting point for a KSA corporate
// services site — NOT legal advice, and NOT reviewed by counsel. Get it
// reviewed before relying on it, then edit further via /admin/pages if needed.
import { eq, and } from "drizzle-orm";
import { db, pageContentTable, pool } from "@workspace/db";

const LAST_UPDATED_EN = "July 2026";
const LAST_UPDATED_AR = "يوليو 2026";

const content = {
  privacy: {
    en: {
      title: "Privacy Policy",
      lastUpdated: LAST_UPDATED_EN,
      body: `Trust Hub Business Solutions ("Trust Hub", "we", "us") respects your privacy and is committed to protecting the personal information you share with us.

This Privacy Policy explains what information we collect, how we use it, and the choices you have, in connection with your use of our website and services.

Information We Collect

When you submit our contact form, request a consultation, or otherwise communicate with us, we may collect your name, email address, phone number, company name, and the content of your message. We also collect standard technical information such as IP address and browser type when you visit our website.

How We Use Your Information

We use the information you provide to respond to your inquiries, provide the services you request, and improve our website and offerings. We do not sell your personal information to third parties.

Data Retention

We retain personal information for as long as necessary to fulfil the purposes described in this policy, or as required by applicable law.

Your Rights

You may request access to, correction of, or deletion of your personal information by contacting us using the details on our Contact page.

Contact Us

If you have questions about this Privacy Policy, please reach out via our Contact page.`,
    },
    ar: {
      title: "سياسة الخصوصية",
      lastUpdated: LAST_UPDATED_AR,
      body: `تحترم ترست هب لحلول الأعمال ("ترست هب"، "نحن") خصوصيتكم وتلتزم بحماية المعلومات الشخصية التي تشاركونها معنا.

توضح سياسة الخصوصية هذه ما هي المعلومات التي نجمعها، وكيفية استخدامها، والخيارات المتاحة لكم فيما يتعلق باستخدامكم لموقعنا الإلكتروني وخدماتنا.

المعلومات التي نجمعها

عند إرسال نموذج التواصل، أو طلب استشارة، أو التواصل معنا بأي طريقة أخرى، قد نجمع اسمكم، وبريدكم الإلكتروني، ورقم هاتفكم، واسم شركتكم، ومحتوى رسالتكم. كما نجمع معلومات تقنية عامة مثل عنوان IP ونوع المتصفح عند زيارتكم لموقعنا.

كيفية استخدام معلوماتكم

نستخدم المعلومات التي تقدمونها للرد على استفساراتكم، وتقديم الخدمات التي تطلبونها، وتحسين موقعنا وخدماتنا. نحن لا نبيع معلوماتكم الشخصية لأطراف ثالثة.

الاحتفاظ بالبيانات

نحتفظ بالمعلومات الشخصية للمدة اللازمة لتحقيق الأغراض الموضحة في هذه السياسة، أو وفقًا لما يقتضيه القانون المعمول به.

حقوقكم

يمكنكم طلب الوصول إلى معلوماتكم الشخصية أو تصحيحها أو حذفها من خلال التواصل معنا عبر البيانات الموضحة في صفحة التواصل.

تواصلوا معنا

إذا كانت لديكم أي أسئلة حول سياسة الخصوصية هذه، يُرجى التواصل معنا عبر صفحة التواصل.`,
    },
  },
  terms: {
    en: {
      title: "Terms of Service",
      lastUpdated: LAST_UPDATED_EN,
      body: `These Terms of Service ("Terms") govern your use of the Trust Hub Business Solutions website and the engagement of our services. By using our website or engaging our services, you agree to these Terms.

Our Services

Trust Hub provides business setup, PRO services, HR & payroll, accounting & tax compliance, business consultancy, and workspace services in Saudi Arabia. The specific scope, fees, and terms of any engagement are set out in a separate service agreement or proposal, which takes precedence over these general Terms where they conflict.

Website Use

You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use of, this website by any third party.

No Professional Advice

Content on this website is provided for general informational purposes only and does not constitute legal, tax, or financial advice. You should seek independent professional advice specific to your circumstances before acting on any information provided here.

Limitation of Liability

To the fullest extent permitted by applicable law, Trust Hub shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website.

Governing Law

These Terms are governed by the laws of the Kingdom of Saudi Arabia.

Contact Us

Questions about these Terms can be directed to us via our Contact page.`,
    },
    ar: {
      title: "شروط الخدمة",
      lastUpdated: LAST_UPDATED_AR,
      body: `تحكم شروط الخدمة هذه ("الشروط") استخدامكم لموقع ترست هب لحلول الأعمال الإلكتروني والتعاقد على خدماتنا. باستخدامكم لموقعنا أو التعاقد معنا على الخدمات، فإنكم توافقون على هذه الشروط.

خدماتنا

تقدّم ترست هب خدمات تأسيس الشركات، والخدمات الحكومية (PRO)، والموارد البشرية والرواتب، والمحاسبة والامتثال الضريبي، والاستشارات التجارية، وخدمات مساحات العمل في المملكة العربية السعودية. يتم تحديد النطاق المحدد والرسوم وشروط أي تعاقد في اتفاقية خدمة أو عرض منفصل، والذي تكون له الأولوية على هذه الشروط العامة في حال التعارض.

استخدام الموقع

توافقون على استخدام هذا الموقع للأغراض المشروعة فقط وبطريقة لا تنتهك حقوق أي طرف ثالث أو تقيّد استخدامه لهذا الموقع.

عدم تقديم استشارة مهنية

المحتوى المتوفر على هذا الموقع مقدّم لأغراض إعلامية عامة فقط ولا يشكّل استشارة قانونية أو ضريبية أو مالية. يُنصح بالحصول على استشارة مهنية مستقلة تتناسب مع ظروفكم الخاصة قبل التصرف بناءً على أي معلومات واردة هنا.

حدود المسؤولية

إلى أقصى حد يسمح به القانون المعمول به، لن تكون ترست هب مسؤولة عن أي أضرار غير مباشرة أو عرضية أو تبعية ناتجة عن استخدامكم لهذا الموقع.

القانون الحاكم

تخضع هذه الشروط لأنظمة المملكة العربية السعودية.

تواصلوا معنا

يمكن توجيه أي استفسارات حول هذه الشروط إلينا عبر صفحة التواصل.`,
    },
  },
} as const;

for (const page of ["privacy", "terms"] as const) {
  for (const locale of ["en", "ar"] as const) {
    const value = content[page][locale];

    const [existing] = await db
      .select({ id: pageContentTable.id })
      .from(pageContentTable)
      .where(and(eq(pageContentTable.page, page), eq(pageContentTable.locale, locale)))
      .limit(1);

    if (existing) {
      await db.update(pageContentTable).set({ content: value, updatedAt: new Date() }).where(eq(pageContentTable.id, existing.id));
      console.log(`Updated ${page}/${locale}`);
    } else {
      await db.insert(pageContentTable).values({ page, locale, content: value });
      console.log(`Inserted ${page}/${locale}`);
    }
  }
}

await pool.end();
