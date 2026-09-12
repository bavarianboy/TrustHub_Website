// One-time, rerunnable Services content update. Keeps all existing admin copy and
// any already-set images while placing Programs first in both languages.
import { and, eq } from "drizzle-orm";
import { db, pageContentTable, pool } from "@workspace/db";

type Service = { id: string; title: string; description: string; features: string[]; image?: string };
type ServicesContent = { list: Service[]; [key: string]: unknown };

const images: Record<string, string> = {
  programs: "/service-images/programs.png",
  "business-setup": "/service-images/business-setup.png",
  "pro-services": "/service-images/pro-services.png",
  "hr-payroll": "/service-images/hr-payroll.png",
  "accounting-tax": "/service-images/accounting-tax.png",
  "business-consultancy": "/service-images/business-consultancy.png",
  "corporate-documents": "/service-images/corporate-documents.png",
};

const programs: Record<"en" | "ar", Service> = {
  en: {
    id: "programs",
    title: "Startup Programs",
    description: "Practical incubation and acceleration programs from Trust Hub Business Solutions, designed to help founders validate ideas, build stronger businesses, and prepare for growth.",
    features: ["Incubator Program for early-stage founders", "Accelerator Program for startups ready to scale", "Mentorship and business development", "Market and investment readiness"],
    image: images.programs,
  },
  ar: {
    id: "programs",
    title: "برامج الشركات الناشئة",
    description: "برامج احتضان وتسريع عملية من شركة ترست هب لحلول الأعمال، تساعد المؤسسين على التحقق من أفكارهم وبناء مشاريع أقوى والاستعداد للنمو.",
    features: ["برنامج الاحتضان للمؤسسين في المراحل المبكرة", "برنامج التسريع للشركات الناشئة الجاهزة للتوسع", "التوجيه وتطوير الأعمال", "الاستعداد للسوق والاستثمار"],
    image: images.programs,
  },
};

try {
  await db.transaction(async tx => {
    for (const locale of ["en", "ar"] as const) {
      const [row] = await tx.select().from(pageContentTable).where(and(eq(pageContentTable.page, "services"), eq(pageContentTable.locale, locale))).limit(1);
      if (!row) throw new Error(`Services content missing for ${locale}`);
      const content = row.content as ServicesContent;
      if (!Array.isArray(content.list)) throw new Error(`Services list invalid for ${locale}`);
      const currentPrograms = content.list.find(service => service.id === "programs");
      const first = currentPrograms ? { ...currentPrograms, image: currentPrograms.image || images.programs } : programs[locale];
      const rest = content.list.filter(service => service.id !== "programs").map(service => ({ ...service, image: service.image || images[service.id] || "" }));
      await tx.update(pageContentTable).set({ content: { ...content, list: [first, ...rest] }, updatedAt: new Date() }).where(eq(pageContentTable.id, row.id));
      console.log(`Updated Services ${locale}: ${rest.length + 1} entries`);
    }
  });
} finally {
  await pool.end();
}
