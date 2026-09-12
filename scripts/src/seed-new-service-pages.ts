// One-time seed: creates the initial EN/AR content rows for the two new
// service pages (Company Formation, Business Incubators & Accelerators)
// introduced by Trust-Hub-Services-Content-Guide.md (2026-08).
//
// English content is transcribed verbatim from that doc. The doc's Arabic
// text arrived as corrupted mojibake (UTF-8 misread as Latin-1, with bytes
// in the 0x80-0x9F range silently stripped somewhere in the document
// pipeline — irrecoverable byte-for-byte, confirmed by inspecting the raw
// byte sequence). Rather than guess at damaged bytes, the Arabic below is a
// fresh translation of the verified English content — review it against the
// original client-provided doc/profile for exact preferred phrasing before
// treating it as final marketing copy.
//
// The Incubators "Impact & Results" section (placeholder [XX] figures in the
// doc) is intentionally omitted — not seeded, not rendered — until real
// numbers are supplied.
//
// Run once, then edit through the admin panel, not by re-running this script.
import { eq, and } from "drizzle-orm";
import { db, pageContentTable, pool } from "@workspace/db";

const companyFormation = {
  en: {
    title: "Company Formation",
    subtitle: "We build your company... and launch your success.",
    introParagraph:
      "Trust Hub is more than a company formation office — we are a legal and administrative advisory team that accompanies clients from the first idea to full operation, with clear, transparent steps built on real experience in the Saudi and global markets. We don't just issue a commercial registration; we launch a legal entity ready to succeed.",
    whyUsHeading: "Why Choose Trust Hub",
    whyUsItems: [
      "Because we don't sell a service... we deliver a result.",
      "Because you work with a team that understands the Saudi system from the inside.",
      "Because you get a dedicated account manager who follows up with you step by step until your commercial registration is issued.",
      "Because we provide everything in one place (a true One-Stop Partner).",
      "Because we uphold confidentiality and transparency in every detail.",
      "Because, simply put... you start with confidence and move forward with stability.",
    ],
    formationServicesHeading: "Company Formation Services",
    formationServicesItems: [
      "Company formation in Saudi Arabia, Oman, Bahrain, the UAE, the USA, and the UK.",
      "100% foreign-owned company formation within the Kingdom.",
      "Company formation with a foreign partner under Saudi investment regulations.",
      "Opening branches for an existing company.",
      "Establishing a GCC company within the Kingdom.",
      "Acquisition, merger, and legal-entity conversion services.",
      "Managing and issuing the Premium Residency program for investors and entrepreneurs.",
      "Drafting and reviewing incorporation contracts and the articles of association.",
      "Trade name reservation and electronic commercial registration.",
      "Issuing commercial, industrial, and professional licenses.",
      "Registering the company with government entities (ZATCA, GOSI, HR platforms, national postal service, Qiwa, Baladi, Muqawil, SABER, and others).",
      "Opening a bank account and linking it with government platforms.",
      "Issuing the Chamber of Commerce certificate and following up on all procedures through to full operation.",
    ],
    postFormationServicesHeading: "Post-Formation Services",
    postFormationServicesItems: [
      "Managing and operating government platforms (Qiwa, Mudad, GOSI, ZATCA, Baladi, Muqawil, SABER, Fasah, the Saudi Authority for Intellectual Property, and others).",
      "Preparing the organizational structure and internal company policies.",
      "Preparing administrative, financial, and HR regulations.",
      "Designing the corporate identity (logo, company profile, business cards, brand collateral).",
      "Setting up official accounts (email, domain, social media accounts).",
      "Support for opening branches and expanding activities.",
      "Trademark registration and intellectual property protection.",
    ],
    additionalServicesHeading: "Additional Services",
    additionalServicesGroups: [
      {
        heading: "A. Accounting & Financial Services",
        items: [
          "Preparing the chart of accounts and financial structure.",
          "Designing financial policies and controlling expenses and revenues.",
          "Monthly bookkeeping and financial reporting.",
          "Preparing financial statements and opening/annual budgets.",
          "Zakat, tax, and income services.",
          "E-invoicing and integration with ZATCA.",
        ],
      },
      {
        heading: "B. Digital Transformation & Business Solutions",
        items: [
          "Business process analysis and mapping.",
          "Integrated ERP solutions (Odoo, SAP, Zoho, and others).",
          "Developing internal systems and enterprise applications.",
          "Transitioning to a fully digital environment for resource and operations management.",
          "Electronic integration between government entities (Tekamul, Muqeem, Mudad, Qiwa, ZATCA...).",
        ],
      },
      {
        heading: "C. Management & Legal Consulting",
        items: [
          "Consulting on establishing and expanding business activities.",
          "Preparing feasibility studies and business plans.",
          "Compliance and governance consulting.",
          "Drafting commercial contracts and agreements.",
          "Financial and administrative performance evaluation.",
          "Support for legal conversion, mergers, and acquisitions.",
        ],
      },
      {
        heading: "D. Entrepreneurship & Investor Services",
        items: [
          "Registering projects with Monsha'at and entrepreneurship programs.",
          "Commercial franchise services.",
          "Support in obtaining government licenses for innovative projects.",
          "Preparing funding and government support files (Monsha'at Bank, financing, guarantees...).",
          "Preparing investor pitch decks and growth plans.",
          "Building local and regional expansion strategies.",
        ],
      },
    ],
    journeyHeading: "Your Journey With Us in 10 Days",
    journeyIntro:
      "Because forming your company shouldn't be a long journey — at Trust Hub, we turn it into a smart, clear experience.",
    journeySteps: [
      {
        day: "Day 1",
        step: "Consultation & activity analysis — preparing a detailed formation plan that defines the right legal structure and path for your company.",
      },
      {
        day: "Day 2",
        step: "Reserving the trade name and preparing the incorporation contract — creating an approved legal identity that reflects your business goals.",
      },
      {
        day: "Day 3",
        step: "Electronic contract notarization — obtaining official approval from the relevant authorities.",
      },
      {
        day: "Day 4–5",
        step: "Issuing the commercial registration and license — turning the idea into a legal entity ready to operate.",
      },
      {
        day: "Day 6–7",
        step: "Registration on government platforms — ensuring full compliance (Zakat, GOSI, Qiwa, investment).",
      },
      {
        day: "Day 8–9",
        step: "Opening the bank account and activating services — full financial and operational readiness.",
      },
      {
        day: "Day 10",
        step: "Delivering the complete file to the client — your company officially launches into the market with confidence and stability.",
      },
    ],
    journeyClosing:
      "Within two weeks at most, your company is fully established — legally and operationally — and ready to launch toward success.",
    numbersHeading: "Trust Hub by the Numbers",
    numbersIntro:
      "Throughout our journey, Trust Hub for Business Solutions has achieved tangible results that reflect our commitment to professionalism and reliable outcomes:",
    numbersStats: [
      "Formed 85+ companies across 6 different countries (Saudi Arabia, the Gulf, and Europe).",
      "Enabled investments exceeding SAR 145 million in client capital across various sectors.",
      "Achieved a 97% client satisfaction rate based on post-service follow-up surveys.",
      "42% of our total clients are international, coming from the Gulf, Europe, and the US.",
      "Maintained a 100% on-time delivery rate with no project delays since 2022.",
      "Oversaw 12 industrial projects that obtained official licenses from the Ministry of Industry and Mineral Resources.",
      "68% of our clients returned to us for additional services thanks to sustained trust and performance.",
    ],
    successStoriesHeading: "Success Stories From Our Clients",
    successStoriesIntro:
      "Every project started as an idea... and we made it real. At Trust Hub, we take pride in being more than an administrative or legal intermediary — we were a real partner in launching genuine success stories inside and outside the Kingdom.",
    successStories: [
      {
        name: "Haseb Company — From Egypt to Riyadh",
        description:
          "In just 8 days, the full formation process, bank account opening, and government system integration were completed.",
        result: "The company began operating through Trust Hub.",
      },
      {
        name: "A Saudi Contracting Company — Me'mar Al Thiqa",
        description: "Restructured the commercial registration and license, and connected government platforms.",
        result: "The company obtained an approved contractor classification and began major government projects.",
      },
      {
        name: "Arab Consultants Group",
        description: "Established a branch within the Kingdom, issued professional licenses, and connected platforms.",
        result: "Became listed among the officially approved consulting offices in Saudi Arabia.",
      },
    ],
    successQuote:
      "With Trust Hub, we didn't feel like clients... we felt like partners. Every step was deliberate and clear.",
    teamHeading: "Our Team",
    teamIntro: "The Trust Hub team is made up of specialized consultants in:",
    teamAreas: [
      "Commercial and investment law.",
      "Saudi government regulations and systems.",
      "Accounting and financial management.",
      "Digital transformation for new businesses.",
      "Business development and project management.",
    ],
    teamClosing:
      "We take pride in a team that combines practical experience with academic knowledge, ensuring precise services aligned with regulatory requirements. We believe trust is built through action, not words — and every investor deserves a partner who understands them before executing on their behalf.",
  },
  ar: {
    title: "تأسيس الشركات",
    subtitle: "نؤسس شركتك... ونطلق نجاحك.",
    introParagraph:
      "تراست هب أكثر من مجرد مكتب لتأسيس الشركات - نحن فريق استشاري قانوني وإداري يرافق عملاءنا من الفكرة الأولى وحتى التشغيل الكامل، بخطوات واضحة وشفافة مبنية على خبرة حقيقية في السوقين السعودي والعالمي. نحن لا نصدر سجلاً تجارياً فقط، بل نطلق كياناً قانونياً جاهزاً للنجاح.",
    whyUsHeading: "لماذا تختار تراست هب",
    whyUsItems: [
      "لأننا لا نبيع خدمة... بل نقدّم نتيجة.",
      "لأنك تتعامل مع فريق يفهم النظام السعودي من الداخل.",
      "لأنك تحصل على مدير حساب مخصص يتابع معك خطوة بخطوة حتى صدور سجلك التجاري.",
      "لأننا نوفر كل شيء في مكان واحد (شريك متكامل حقيقي).",
      "لأننا نحافظ على السرية والشفافية في كل تفصيل.",
      "لأنك ببساطة... تبدأ بثقة وتمضي بثبات.",
    ],
    formationServicesHeading: "خدمات تأسيس الشركات",
    formationServicesItems: [
      "تأسيس الشركات في السعودية، عُمان، البحرين، الإمارات، أمريكا، وبريطانيا.",
      "تأسيس شركة أجنبية بنسبة 100% داخل المملكة.",
      "تأسيس شركات بشريك أجنبي وفق الأنظمة الاستثمارية السعودية.",
      "فتح فروع لشركة قائمة.",
      "تأسيس شركة خليجية داخل المملكة.",
      "خدمات الاستحواذ والاندماج وتحويل الكيانات القانونية.",
      "إدارة واستخراج برنامج الإقامة المميزة للمستثمرين ورواد الأعمال.",
      "إعداد ومراجعة عقود التأسيس والنظام الأساسي.",
      "حجز الاسم التجاري وتوثيق السجل التجاري إلكترونياً.",
      "إصدار التراخيص التجارية والصناعية والمهنية.",
      "تسجيل الشركة لدى الجهات الحكومية (الزكاة والضريبة والجمارك، التأمينات، الموارد البشرية، البريد الوطني، منصة قوى، منصة بلدي، منصة مقاولي، سابر، وغيرها).",
      "فتح الحساب البنكي وربطه بالمنصات الحكومية.",
      "إصدار شهادة الغرفة التجارية ومتابعة جميع الإجراءات حتى التشغيل الفعلي.",
    ],
    postFormationServicesHeading: "خدمات ما بعد التأسيس",
    postFormationServicesItems: [
      "إدارة وتشغيل المنصات الحكومية (قوى، مدد، التأمينات، الزكاة والضريبة والجمارك، بلدي، مقاولي، سابر، فسح، الهيئة السعودية للملكية الفكرية، وغيرها).",
      "إعداد الهيكل التنظيمي والسياسات الداخلية للشركة.",
      "إعداد اللوائح الإدارية والمالية والموارد البشرية.",
      "تصميم الهوية المؤسسية (الشعار، البروفايل، بطاقة الأعمال، المواد التعريفية).",
      "إنشاء الحسابات الرسمية (البريد الإلكتروني، النطاق الإلكتروني، حسابات التواصل الاجتماعي).",
      "دعم فتح الفروع والتوسع في الأنشطة.",
      "تسجيل العلامة التجارية وحماية الملكية الفكرية.",
    ],
    additionalServicesHeading: "خدمات إضافية",
    additionalServicesGroups: [
      {
        heading: "أ. الخدمات المحاسبية والمالية",
        items: [
          "إعداد الدليل المحاسبي والشجرة المالية.",
          "تصميم السياسات المالية وضبط المصروفات والإيرادات.",
          "مسك الدفاتر المحاسبية الشهرية وإعداد التقارير المالية.",
          "إعداد القوائم المالية والميزانية الافتتاحية والسنوية.",
          "خدمات الزكاة والضريبة والدخل.",
          "الفوترة الإلكترونية والتكامل مع هيئة الزكاة والضريبة والجمارك (ZATCA).",
        ],
      },
      {
        heading: "ب. التحول الرقمي وحلول الأعمال",
        items: [
          "تحليل وتوثيق العمليات التشغيلية.",
          "تقديم حلول ERP متكاملة (Odoo، SAP، Zoho، وغيرها).",
          "تطوير الأنظمة الداخلية والتطبيقات المؤسسية.",
          "التحول إلى بيئة رقمية شاملة لإدارة الموارد والعمليات.",
          "الربط الإلكتروني بين الجهات الحكومية (تكامل، مقيم، مدد، قوى، زاتكا...).",
        ],
      },
      {
        heading: "ج. الاستشارات الإدارية والقانونية",
        items: [
          "استشارات تأسيس وتوسعة الأنشطة التجارية.",
          "إعداد دراسات الجدوى وخطط العمل.",
          "استشارات الامتثال والحوكمة.",
          "صياغة العقود والاتفاقيات التجارية.",
          "تقييم الأداء المالي والإداري.",
          "دعم عمليات التحويل القانوني والاندماج والاستحواذ.",
        ],
      },
      {
        heading: "د. خدمات ريادة الأعمال والمستثمرين",
        items: [
          "تسجيل المشاريع في منشآت وبرامج ريادة الأعمال.",
          "خدمات الامتياز التجاري.",
          "دعم الحصول على التراخيص الحكومية للمشاريع الابتكارية.",
          "إعداد ملفات التمويل والدعم الحكومي (بنك المنشآت، تمويل، ضمانة...).",
          "إعداد عروض المستثمرين وخطط النمو.",
          "بناء استراتيجيات التوسع محلياً وإقليمياً.",
        ],
      },
    ],
    journeyHeading: "رحلتك معنا خلال 10 أيام",
    journeyIntro: "لأن تأسيس شركتك لا يجب أن يكون رحلة طويلة، نحوّلها في تراست هب إلى تجربة ذكية وواضحة.",
    journeySteps: [
      {
        day: "اليوم 1",
        step: "استشارة وتحليل النشاط — إعداد خطة تأسيس مفصّلة تحدد الشكل القانوني والمسار الأنسب لشركتك.",
      },
      {
        day: "اليوم 2",
        step: "حجز الاسم التجاري وإعداد عقد التأسيس — إنشاء هوية قانونية معتمدة تعكس أهدافك التجارية.",
      },
      { day: "اليوم 3", step: "توثيق العقد إلكترونياً — الحصول على الاعتماد الرسمي من الجهات المختصة." },
      {
        day: "اليوم 4–5",
        step: "إصدار السجل التجاري والرخصة — تحويل الفكرة إلى كيان قانوني جاهز للعمل.",
      },
      {
        day: "اليوم 6–7",
        step: "التسجيل في المنصات الحكومية — ضمان الامتثال الكامل للأنظمة (الزكاة، التأمينات، قوى، الاستثمار).",
      },
      { day: "اليوم 8–9", step: "فتح الحساب البنكي وتفعيل الخدمات — جاهزية مالية وتشغيلية كاملة." },
      { day: "اليوم 10", step: "تسليم الملف الكامل للعميل — شركتك تنطلق رسمياً في السوق بثقة واستقرار." },
    ],
    journeyClosing:
      "خلال أسبوعين على الأكثر، تكون شركتك قد تأسست بالكامل — قانونياً وتشغيلياً — وجاهزة للانطلاق نحو النجاح.",
    numbersHeading: "تراست هب بالأرقام",
    numbersIntro:
      "خلال مسيرتنا المهنية، حققت تراست هب لحلول الأعمال إنجازات ملموسة تعبّر عن التزامنا بالاحترافية والنتائج الموثوقة:",
    numbersStats: [
      "أسسنا أكثر من 85 شركة في 6 دول مختلفة (السعودية، الخليج، وأوروبا).",
      "مكّنّا استثمارات تجاوزت 145 مليون ريال سعودي من رؤوس أموال عملائنا في مختلف القطاعات.",
      "بلغ معدل رضا العملاء 97% وفق استبيانات المتابعة بعد تنفيذ الخدمات.",
      "بلغت نسبة العملاء الأجانب 42% من إجمالي عملائنا، قادمين من دول الخليج وأوروبا وأمريكا.",
      "حافظنا على نسبة التزام زمني 100% دون أي تأخير في تسليم المشاريع منذ عام 2022.",
      "أشرفنا على 12 مشروعاً صناعياً حاصلاً على تراخيص رسمية من وزارة الصناعة والثروة المعدنية.",
      "عاد 68% من عملائنا للتعامل معنا مجدداً لخدمات إضافية بفضل الثقة والاستمرارية في الأداء.",
    ],
    successStoriesHeading: "قصص نجاح من عملائنا",
    successStoriesIntro:
      "كل مشروع بدأ بفكرة... وجعلناها حقيقة. في تراست هب، نفخر بأننا لسنا مجرد وسيط إداري أو قانوني، بل كنا شريكاً حقيقياً في إطلاق قصص نجاح حقيقية داخل المملكة وخارجها.",
    successStories: [
      {
        name: "شركة حاسب - من مصر إلى الرياض",
        description: "خلال 8 أيام فقط، تمت عملية التأسيس الكاملة، وفتح الحساب البنكي، وربط الأنظمة الحكومية.",
        result: "بدأت الشركة ممارسة نشاطها التشغيلي عبر تراست هب.",
      },
      {
        name: "شركة مقاولات سعودية - معيار الثقة",
        description: "تمت إعادة هيكلة السجل والترخيص التجاري وربط المنصات.",
        result: "حصلت الشركة على تصنيف مقاول معتمد وبدأت مشاريع حكومية كبرى.",
      },
      {
        name: "مجموعة الاستشاريين العرب",
        description: "تأسيس فرع داخل المملكة وإصدار التراخيص المهنية وربط المنصات.",
        result: "أصبحت ضمن قائمة المكاتب الاستشارية المعتمدة رسمياً في السعودية.",
      },
    ],
    successQuote: "مع تراست هب لم نشعر أننا عملاء... بل شركاء. كل خطوة كانت محسوبة وواضحة.",
    teamHeading: "فريقنا",
    teamIntro: "يتكون فريق تراست هب من مستشارين متخصصين في مجالات:",
    teamAreas: [
      "القانون التجاري والاستثماري.",
      "الأنظمة الحكومية السعودية.",
      "المحاسبة والإدارة المالية.",
      "التحول الرقمي للمنشآت الجديدة.",
      "تطوير الأعمال وإدارة المشاريع.",
    ],
    teamClosing:
      "نفخر بأن فريقنا يجمع بين الخبرة العملية والمعرفة الأكاديمية، بما يضمن تقديم خدمات دقيقة تتماشى مع المتطلبات النظامية. نؤمن بأن الثقة تُبنى بالفعل لا بالكلام، وأن كل مستثمر يستحق شريكاً يفهمه قبل أن ينفذ نيابة عنه.",
  },
};

const businessIncubators = {
  en: {
    title: "Business Incubators & Accelerators",
    subtitle:
      "We turn ideas and startups into ready-to-deploy solutions for Saudi Arabia's government and enterprise sectors.",
    introParagraph:
      "We design and deliver innovation programs built around real, sector-specific challenges — not generic one-size-fits-all initiatives. Working alongside government entities, large corporations, and startups, we build measurable pilots that shorten the distance between an idea and real-world deployment, driving economic and operational impact aligned with Saudi Vision 2030.",
    whyUsHeading: "Why Choose Trust Hub",
    whyUsItems: [
      "Sector-First model: Our programs are built around specific sector challenges (health, logistics, tech, education, tourism, finance) rather than generic programs.",
      "Outcomes over activity: Every program becomes a clear platform for measurable outputs — pilots, real solution adoption, and reduced time-to-value.",
      "A full operating partner: We go beyond the traditional accelerator role, managing relationships with government and institutional entities and connecting solutions to real deployment environments from design through delivery.",
      "A broad partner network: We work across the government enablement and entrepreneurship ecosystem, tech entities, universities and research centers, and institutional/investment partners.",
      "Knowledge transfer & lasting impact: We hand over operational playbooks and train the beneficiary's teams to sustain impact after the program ends.",
    ],
    programsHeading: "Our Flagship Programs",
    programs: [
      {
        name: "Sectoral Innovation Challenges (4 annual cycles)",
        description:
          "A year-long program split into four cycles, each targeting a specific sector in search of ready-to-apply solutions to a real challenge.",
        includes: "A challenge-scoping workshop, an open call for applications, an advanced bootcamp, pilot testing, and a closing showcase event.",
        bestFor: "Best for: Government and regulatory bodies seeking applicable, innovative solutions.",
      },
      {
        name: "Scaleups Accelerator for Government & Enterprise Access",
        description:
          "Built for growth-stage companies, helping them enter the government and enterprise market through specialized mentorship, business development support, alignment with government requirements, and access to partnership and contracting channels.",
        includes: "Specialized mentorship, business development support, regulatory alignment, and partnership access.",
        bestFor: "Best for: Growth-ready startups seeking government or enterprise contracts and partnerships.",
      },
      {
        name: "Corporate Innovation Sprint",
        description:
          "A short 6–10 week program for large companies and institutions, turning internal ideas into testable prototypes through rapid ideation sessions, prototyping, and internal pilots.",
        includes: "Rapid ideation sessions, prototyping, and internal pilots.",
        bestFor: "Best for: Large corporations and institutions looking to accelerate internal innovation quickly.",
      },
    ],
    howItWorksHeading: "How We Work",
    howItWorksSteps: [
      { title: "Discovery & Scoping", description: "We analyze the entity's needs, define the sector challenge, and set success KPIs." },
      { title: "Program Design", description: "We design the program content, activity plan, and evaluation tools." },
      { title: "Delivery & Enablement", description: "Bootcamps, specialized mentorship sessions, and prototyping workshops." },
      {
        title: "Pilots & Implementation",
        description: "Running pilot tests within the beneficiary's environment, measuring technical and financial impact.",
      },
      {
        title: "Reporting & Handover",
        description: "Periodic reports, a performance dashboard, lessons learned, and full handover of outputs.",
      },
    ],
    partnersHeading: "Our Partner Network",
    partners: [
      {
        label: "Government enablement & entrepreneurship ecosystem",
        description: "In partnership with Monsha'at and national operators of incubator and accelerator programs.",
      },
      { label: "Tech & digital transformation entities", description: "Partnerships spanning FinTech, Cyber, AI, and GovTech." },
      { label: "Digital government ecosystem", description: "Full compliance with government digital standards and requirements." },
      {
        label: "Universities & research centers",
        description: "Collaboration on applied research, prototype development, and proof-of-concept testing.",
      },
      {
        label: "Institutional & investment partners",
        description: "Major corporations and investment funds enabling funding channels and rapid solution adoption.",
      },
    ],
    ctaHeading: "Ready to Build Your Next Innovation Program With Us?",
    ctaParagraph:
      "Whether you're a government entity seeking applicable solutions, a startup ready to scale, or an enterprise looking to accelerate internal innovation — Trust Hub is your partner in turning ideas into real impact.",
    ctaButton: "Contact Us",
  },
  ar: {
    title: "حاضنات ومسرعات الأعمال",
    subtitle: "نحوّل الأفكار والشركات الناشئة إلى حلول جاهزة للتطبيق داخل القطاعين الحكومي والمؤسسي في السعودية.",
    introParagraph:
      "نصمم وننفذ برامج ابتكار مبنية على تحديات قطاعية حقيقية، بدلاً من البرامج العامة النمطية. نعمل مع الجهات الحكومية والشركات الكبرى والشركات الناشئة لبناء تجارب قابلة للقياس تختصر المسافة بين الفكرة والتطبيق الفعلي، وتحقق أثراً اقتصادياً وتشغيلياً يواكب مستهدفات رؤية السعودية 2030.",
    whyUsHeading: "لماذا تختار تراست هب",
    whyUsItems: [
      "نموذج قائم على القطاعات أولاً: برامجنا مصممة حول تحديات قطاعية محددة (الصحة، اللوجستيات، التقنية، التعليم، السياحة، المالية)، وليست برامج عامة.",
      "التركيز على النتائج لا الأنشطة: كل برنامج يتحول إلى منصة واضحة لمخرجات قابلة للقياس: تجارب تطبيقية، تبنٍّ فعلي للحلول، وتقليل زمن الوصول للقيمة.",
      "شريك تشغيل متكامل: لا نتوقف عند دور المسرّع التقليدي، بل ندير العلاقة مع الجهات الحكومية والمؤسسية ونربط الحلول ببيئات تطبيق حقيقية من التصميم حتى التسليم.",
      "شبكة شراكات واسعة: نعمل مع منظومة التمكين الحكومي وريادة الأعمال، الجهات التقنية، الجامعات ومراكز البحث، والشركاء المؤسسيين والاستثماريين.",
      "نقل المعرفة واستدامة الأثر: نسلّم أدلة عمل وندرّب فرق الجهة المستفيدة لضمان استمرار الأثر بعد انتهاء البرنامج.",
    ],
    programsHeading: "برامجنا الرئيسية",
    programs: [
      {
        name: "سلسلة تحديات ابتكار قطاعية (4 دورات سنوية)",
        description:
          "برنامج سنوي يُقسّم إلى أربع دورات، كل دورة تستهدف قطاعاً محدداً بحثاً عن حلول جاهزة للتطبيق لتحدٍّ حقيقي فيه.",
        includes: "ورشة تحديد التحدي، فتح باب التقديم، معسكر تدريبي متقدم، تجارب تطبيقية، وحفل عرض ختامي.",
        bestFor: "الأنسب لـ: الجهات الحكومية والتنظيمية الباحثة عن حلول ابتكارية قابلة للتطبيق.",
      },
      {
        name: "مسرّعة Scaleups لدخول القطاع الحكومي والمؤسسي",
        description:
          "مصممة للشركات في مرحلة النمو، لتمكينها من دخول السوق الحكومي والمؤسسي عبر إرشاد متخصص، دعم تطوير الأعمال، ومواءمة مع متطلبات الجهات الحكومية.",
        includes: "إرشاد متخصص، دعم تطوير الأعمال، مواءمة تنظيمية، وفتح قنوات شراكات وتعاقدات.",
        bestFor: "الأنسب لـ: الشركات الناشئة الجاهزة للتوسع والباحثة عن عقود وشراكات حكومية أو مؤسسية.",
      },
      {
        name: "برنامج ابتكار مؤسسي سريع",
        description:
          "برنامج قصير المدى (6–10 أسابيع) للشركات والجهات الكبرى، يحوّل الأفكار الداخلية إلى نماذج أولية قابلة للتجربة.",
        includes: "جلسات توليد أفكار سريعة، بناء نماذج أولية، وتجارب داخلية.",
        bestFor: "الأنسب لـ: الشركات والمؤسسات الكبرى الراغبة في تسريع الابتكار الداخلي بسرعة.",
      },
    ],
    howItWorksHeading: "كيف نعمل",
    howItWorksSteps: [
      { title: "الاكتشاف وتحديد النطاق", description: "نحلل احتياجات الجهة، ونحدد التحدي القطاعي، ومؤشرات النجاح." },
      { title: "تصميم البرنامج", description: "نصمم المحتوى الفني، خطة الأنشطة، وأدوات التقييم والمتابعة." },
      { title: "التنفيذ والتمكين", description: "معسكرات تدريبية، جلسات إرشاد متخصصة، وورش تطوير النماذج الأولية." },
      { title: "التجربة والتطبيق", description: "تشغيل تجارب تطبيقية داخل بيئة الجهة، وقياس الأثر الفني والمالي." },
      { title: "التقارير والتسليم", description: "تقارير دورية، لوحة مؤشرات أداء، دروس مستفادة، وتسليم كامل للمخرجات للجهة." },
    ],
    partnersHeading: "شبكة شركائنا",
    partners: [
      {
        label: "منظومة التمكين الحكومي وريادة الأعمال",
        description: "بالتعاون مع منشآت والمشغلين الوطنيين لبرامج الحاضنات والمسرعات.",
      },
      { label: "الجهات التقنية والتحول الرقمي", description: "شراكات في مجالات التقنية المالية، الأمن السيبراني، الذكاء الاصطناعي، والتقنية الحكومية." },
      { label: "منظومة الحكومة الرقمية", description: "التزام كامل بمعايير ومتطلبات الجهات الحكومية الرقمية." },
      {
        label: "الجامعات ومراكز البحث",
        description: "تعاون في الأبحاث التطبيقية، تطوير النماذج الأولية، واختبارات إثبات المفهوم.",
      },
      {
        label: "الشركاء المؤسسيون والاستثماريون",
        description: "شركات كبرى وصناديق استثمارية تفتح قنوات تمويل وتبنٍّ سريع للحلول.",
      },
    ],
    ctaHeading: "جاهزون لبناء برنامج الابتكار القادم معنا؟",
    ctaParagraph:
      "سواء كنت جهة حكومية تبحث عن حلول قابلة للتطبيق، أو شركة ناشئة جاهزة للنمو، أو مؤسسة ترغب في تسريع الابتكار الداخلي - تراست هب شريكك في تحويل الفكرة إلى أثر حقيقي.",
    ctaButton: "تواصل معنا",
  },
};

const PAGES: Record<string, { en: unknown; ar: unknown }> = {
  "company-formation": companyFormation,
  "business-incubators-accelerators": businessIncubators,
};

for (const [page, content] of Object.entries(PAGES)) {
  for (const locale of ["en", "ar"] as const) {
    const [existing] = await db
      .select({ id: pageContentTable.id })
      .from(pageContentTable)
      .where(and(eq(pageContentTable.page, page as never), eq(pageContentTable.locale, locale)))
      .limit(1);

    if (existing) {
      await db
        .update(pageContentTable)
        .set({ content: content[locale], updatedAt: new Date() })
        .where(eq(pageContentTable.id, existing.id));
      console.log(`Updated ${page}/${locale}`);
    } else {
      await db.insert(pageContentTable).values({ page: page as never, locale, content: content[locale] });
      console.log(`Inserted ${page}/${locale}`);
    }
  }
}

await pool.end();
