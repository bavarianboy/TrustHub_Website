// Safe to rerun: inserts only missing page/locale rows and never replaces admin edits.
import { db, pageContentTable, pool } from "@workspace/db";

const section = (heading: string, description: string, items: string[]) => ({ heading, description, items });

const content = {
  programs: {
    en: {
      title: "Our Programs",
      subtitle: "Built for founders at every stage of the entrepreneurial journey.",
      intro: "Every startup is different. Trust Hub Business Solutions offers practical programs that help founders validate ideas, build stronger businesses, and prepare for sustainable growth.",
      sections: [section("Choose your next step", "Explore the program that matches your current stage and ambitions.", ["Incubator: turn a promising idea or early product into a viable business.", "Accelerator: turn a validated startup into a scalable, investment-ready company."])],
      cards: [
        { slug: "incubator-program", title: "Incubator Program", description: "Practical support for early-stage founders moving from idea and initial traction toward a sustainable business.", focusAreas: ["Strategy", "Operations", "Market validation", "Business models", "Product development", "Growth readiness"] },
        { slug: "accelerator-program", title: "Accelerator Program", description: "An intensive, milestone-driven program for startups with an MVP, early customers, or measurable traction.", focusAreas: ["Revenue growth", "Market expansion", "Governance", "Operations", "Investment readiness"] },
      ],
    },
    ar: {
      title: "برامجنا",
      subtitle: "برامج مصممة لدعم المؤسسين في كل مرحلة من رحلتهم الريادية.",
      intro: "لكل شركة ناشئة احتياجات مختلفة. تقدم شركة ترست هب لحلول الأعمال برامج عملية تساعد المؤسسين على التحقق من أفكارهم وبناء أعمال أقوى والاستعداد لنمو مستدام.",
      sections: [section("اختر خطوتك التالية", "استكشف البرنامج الذي يناسب مرحلة مشروعك وطموحاتك الحالية.", ["الاحتضان: تحويل فكرة واعدة أو منتج أولي إلى مشروع قابل للاستمرار.", "التسريع: تطوير شركة ناشئة تحققت من فكرتها لتصبح قابلة للتوسع وجاهزة للاستثمار."])],
      cards: [
        { slug: "incubator-program", title: "برنامج الاحتضان", description: "دعم عملي للمؤسسين في المراحل المبكرة للانتقال من الفكرة والنتائج الأولية إلى مشروع مستدام.", focusAreas: ["الاستراتيجية", "العمليات", "التحقق من السوق", "نماذج الأعمال", "تطوير المنتج", "الاستعداد للنمو"] },
        { slug: "accelerator-program", title: "برنامج التسريع", description: "برنامج مكثف قائم على مراحل واضحة للشركات الناشئة التي لديها منتج أولي أو عملاء أو مؤشرات نمو مبكرة.", focusAreas: ["نمو الإيرادات", "التوسع في السوق", "الحوكمة", "العمليات", "الجاهزية للاستثمار"] },
      ],
    },
  },
  "incubator-program": {
    en: {
      title: "Incubator Program",
      subtitle: "From promising idea to viable, sustainable business.",
      intro: "Trust Hub Business Solutions supports entrepreneurs and early-stage startups through practical guidance, mentorship, and structured business development.",
      sections: [
        section("Your journey", "Build the foundations for an executable business, step by step.", ["Refine the idea and test assumptions", "Understand target customers and competitors", "Validate customer needs and the market", "Develop the business and revenue models", "Develop the product or service", "Build commercial and marketing strategies", "Prepare operations and a go-to-market plan", "Get ready for growth"]),
        section("Who it is for", "Suitable for first-time founders and early-stage teams.", ["Entrepreneurs with a clear business idea", "Founders with an initial concept", "Early-stage startups", "Teams developing an early product", "Startups preparing to enter the market"]),
        section("What participants gain", "Support is tailored to each startup's stage and needs.", ["Practical business knowledge", "Mentorship and business development support", "Market insights and startup development tools", "A more sustainable business model", "Greater market readiness"]),
        section("Focus areas", "A practical framework for moving from idea to execution.", ["Idea validation", "Business model development", "Market research", "Product development", "Go-to-market strategy", "Operations", "Growth readiness"]),
        section("General terms", "Applicants should be ready to participate actively.", ["Have a clear idea, project, or early-stage startup", "Show potential to develop and grow", "Commit to workshops, mentoring, and program activities", "Address a real market need or customer problem", "Submit accurate and complete information", "Follow Trust Hub Business Solutions program policies, requirements, and deadlines", "Pass the evaluation and admission process"]),
        section("First-time founders", "The program builds the knowledge, skills, and structure needed to turn an idea into an executable business.", ["Learn foundational business skills", "Develop a practical structure for your venture"]),
        section("Ready to apply?", "Send us your inquiry through the contact page. Incubator inquiries are reviewed within approximately 3–5 business days.", []),
      ],
      cards: [],
    },
    ar: {
      title: "برنامج الاحتضان",
      subtitle: "من فكرة واعدة إلى مشروع قابل للاستمرار والنمو.",
      intro: "تدعم شركة ترست هب لحلول الأعمال رواد الأعمال والشركات الناشئة في مراحلها المبكرة من خلال الإرشاد العملي والتوجيه وتطوير الأعمال بخطوات منظمة.",
      sections: [
        section("رحلتك في البرنامج", "ابنِ أسس مشروع قابل للتنفيذ خطوة بخطوة.", ["صقل الفكرة واختبار الفرضيات", "فهم العملاء المستهدفين والمنافسين", "التحقق من احتياجات العملاء والسوق", "تطوير نموذج العمل والإيرادات", "تطوير المنتج أو الخدمة", "بناء الاستراتيجيات التجارية والتسويقية", "تجهيز العمليات وخطة دخول السوق", "الاستعداد للنمو"]),
        section("لمن صُمم البرنامج؟", "يناسب المؤسسين لأول مرة والفرق في المراحل المبكرة.", ["رواد أعمال لديهم فكرة واضحة", "مؤسسون لديهم تصور أولي", "شركات ناشئة في مراحلها الأولى", "فرق تطور منتجًا أوليًا", "شركات تستعد لدخول السوق"]),
        section("ماذا يستفيد المشاركون؟", "يتكيف الدعم مع مرحلة كل شركة ناشئة واحتياجاتها.", ["معرفة عملية في الأعمال", "توجيه ودعم لتطوير الأعمال", "رؤى حول السوق وأدوات لتطوير الشركات الناشئة", "نموذج عمل أكثر استدامة", "جاهزية أفضل لدخول السوق"]),
        section("مجالات التركيز", "إطار عملي للانتقال من الفكرة إلى التنفيذ.", ["التحقق من الفكرة", "تطوير نموذج العمل", "أبحاث السوق", "تطوير المنتج", "استراتيجية دخول السوق", "العمليات", "الاستعداد للنمو"]),
        section("الشروط العامة", "نتطلع إلى متقدمين مستعدين للمشاركة الفاعلة.", ["امتلاك فكرة واضحة أو مشروع أو شركة ناشئة في مرحلة مبكرة", "إظهار إمكانات للتطور والنمو", "الالتزام بالورش وجلسات التوجيه وأنشطة البرنامج", "معالجة حاجة سوقية أو مشكلة حقيقية للعملاء", "تقديم معلومات دقيقة ومكتملة", "الالتزام بسياسات ومتطلبات ومواعيد برامج شركة ترست هب لحلول الأعمال", "اجتياز التقييم والقبول"]),
        section("المؤسسون لأول مرة", "يساعد البرنامج على بناء المعرفة والمهارات والهيكل العملي اللازم لتحويل الفكرة إلى مشروع قابل للتنفيذ.", ["اكتساب مهارات الأعمال الأساسية", "تطوير هيكل عملي للمشروع"]),
        section("هل أنت مستعد للتقديم؟", "أرسل استفسارك عبر صفحة التواصل. تُراجع استفسارات برنامج الاحتضان خلال نحو ٣–٥ أيام عمل.", []),
      ],
      cards: [],
    },
  },
  "accelerator-program": {
    en: {
      title: "Accelerator Program",
      subtitle: "Milestone-driven growth for startups ready to scale.",
      intro: "Trust Hub Business Solutions helps startups beyond idea validation strengthen operations, expand their markets, and prepare for investment. Participants typically have an MVP, early traction, or early customers.",
      sections: [
        section("Program objectives", "Move from early validation to a stronger growth engine.", ["Scale the business", "Improve operations", "Expand into new markets", "Prepare for investment", "Strengthen governance", "Improve financial readiness"]),
        section("Revenue and market expansion", "Build a repeatable commercial engine.", ["Revenue growth", "Customer acquisition", "Market expansion", "Commercial growth"]),
        section("Governance, financials, and operations", "Strengthen the systems that support sustainable scale.", ["Governance", "Financial management", "Operational processes", "Organizational readiness"]),
        section("Investment readiness", "Prepare founders for productive funding conversations.", ["Investor engagement", "Fundraising", "Investment discussions", "Funding rounds"]),
        section("Who it is for", "Designed for startups ready for a structured growth program.", ["Startups with an MVP", "Startups with early customers or measurable traction", "Founders seeking growth", "Companies seeking partnerships", "Companies preparing to raise capital or attract investment"]),
        section("Value for investors", "The program aims to reduce investment risk by improving execution, governance, and operational readiness.", ["Stronger execution", "Clearer governance", "Greater operational readiness"]),
        section("Ecosystem impact goals", "Trust Hub Business Solutions aims to help build a stronger startup ecosystem. These are program goals, not claims of achieved outcomes.", ["Improve startup success rates", "Support stronger funding conversion", "Build a capable alumni network", "Create a structured path toward Demo Day", "Encourage follow-on investment opportunities"]),
      ],
      cards: [],
    },
    ar: {
      title: "برنامج التسريع",
      subtitle: "نمو قائم على مراحل واضحة للشركات الناشئة الجاهزة للتوسع.",
      intro: "تساعد شركة ترست هب لحلول الأعمال الشركات الناشئة التي تجاوزت مرحلة التحقق من الفكرة على تعزيز عملياتها والتوسع في الأسواق والاستعداد للاستثمار. وعادةً ما يكون لدى المشاركين منتج أولي أو مؤشرات نمو أو عملاء أوائل.",
      sections: [
        section("أهداف البرنامج", "الانتقال من التحقق المبكر إلى محرك نمو أقوى.", ["توسيع نطاق الأعمال", "تحسين العمليات", "التوسع في أسواق جديدة", "الاستعداد للاستثمار", "تعزيز الحوكمة", "رفع الجاهزية المالية"]),
        section("الإيرادات والتوسع في السوق", "بناء نشاط تجاري قابل للتكرار والنمو.", ["نمو الإيرادات", "استقطاب العملاء", "التوسع في السوق", "النمو التجاري"]),
        section("الحوكمة والمالية والعمليات", "تعزيز الأنظمة التي تدعم التوسع المستدام.", ["الحوكمة", "الإدارة المالية", "العمليات التشغيلية", "الجاهزية المؤسسية"]),
        section("الجاهزية للاستثمار", "تجهيز المؤسسين لحوارات تمويل مثمرة.", ["التواصل مع المستثمرين", "جمع التمويل", "مناقشات الاستثمار", "جولات التمويل"]),
        section("لمن صُمم البرنامج؟", "للشركات الناشئة المستعدة لبرنامج نمو منظم.", ["شركات لديها منتج أولي", "شركات لديها عملاء أوائل أو مؤشرات نمو قابلة للقياس", "مؤسسون يسعون للنمو", "شركات تبحث عن شراكات", "شركات تستعد لجمع رأس المال أو جذب الاستثمار"]),
        section("قيمة البرنامج للمستثمرين", "يهدف البرنامج إلى تقليل مخاطر الاستثمار عبر تحسين التنفيذ والحوكمة والجاهزية التشغيلية.", ["تنفيذ أقوى", "حوكمة أوضح", "جاهزية تشغيلية أعلى"]),
        section("أهداف الأثر في المنظومة", "تهدف شركة ترست هب لحلول الأعمال إلى المساهمة في بناء منظومة أقوى للشركات الناشئة. هذه أهداف للبرنامج وليست نتائج متحققة.", ["تحسين فرص نجاح الشركات الناشئة", "دعم فرص الحصول على التمويل", "بناء شبكة خريجين فاعلة", "إنشاء مسار منظم نحو يوم العروض", "تشجيع فرص الاستثمار اللاحقة"]),
      ],
      cards: [],
    },
  },
} as const;

try {
  // Add only the three Programs values; db:push may include unrelated in-progress schema edits.
  for (const page of ["programs", "incubator-program", "accelerator-program"] as const) {
    await pool.query(`ALTER TYPE page_content_page ADD VALUE IF NOT EXISTS '${page}'`);
  }
  for (const [page, locales] of Object.entries(content)) {
    for (const [locale, value] of Object.entries(locales)) {
      await db.insert(pageContentTable).values({ page: page as typeof pageContentTable.$inferInsert.page, locale: locale as "en" | "ar", content: value }).onConflictDoNothing({ target: [pageContentTable.page, pageContentTable.locale] });
      console.log(`Seeded if missing: ${page}/${locale}`);
    }
  }
} finally {
  await pool.end();
}
