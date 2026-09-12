import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, Compass, Rocket, Sparkles, ArrowUpRight } from "lucide-react";
import { useGetProgramPageContent } from "@workspace/api-client-react";
import type { ProgramPage as ProgramPageSlug } from "@workspace/api-client-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { Skeleton } from "@/components/ui/skeleton";
import type { Locale } from "@/i18n";

const paths: Record<ProgramPageSlug, string> = {
  programs: "/programs",
  "incubator-program": "/programs/incubator-program",
  "accelerator-program": "/programs/accelerator-program",
};

export function ProgramPage({ page }: { page: ProgramPageSlug }) {
  const { i18n, t } = useTranslation();
  const locale = i18n.language as Locale;
  const { data, isLoading, isError } = useGetProgramPageContent(page, { locale });
  useDocumentMeta(data?.title ?? t("nav.programs"), data?.subtitle ?? "", paths[page]);

  if (isLoading) return <div className="container mx-auto px-4 pt-40 pb-24 space-y-8"><Skeleton className="h-12 w-2/3" /><Skeleton className="h-6 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (isError || !data) return <div className="container mx-auto px-4 pt-40 pb-24 text-center text-muted-foreground">{t("programs.loadError")}</div>;

  const isOverview = page === "programs";
  return <main className="pt-24 bg-background">
    <section className="relative overflow-hidden bg-foreground text-white py-20 md:py-28">
      <div className="absolute -top-32 -end-20 h-96 w-96 rounded-full border border-primary/25" aria-hidden="true" />
      <div className="absolute top-12 end-16 h-72 w-72 rounded-full border border-primary/20" aria-hidden="true" />
      <div className="container mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-[1.4fr_0.6fr] gap-12 items-center">
        <div>
          <p className="text-primary uppercase tracking-[0.22em] font-semibold text-sm mb-6">{t("nav.programs")}</p>
          <h1 className="font-serif font-bold text-4xl md:text-6xl leading-tight max-w-3xl">{data.title}</h1>
          <p className="text-xl text-white/80 mt-7 max-w-2xl leading-relaxed">{data.subtitle}</p>
          {!isOverview && <div className="flex flex-wrap gap-3 mt-9">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-sm font-semibold hover:bg-primary/90">{t("programs.apply")}<ArrowUpRight size={18} /></Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-white/40 px-6 py-3 rounded-sm font-semibold hover:bg-white/10">{t("programs.consult")}</Link>
          </div>}
        </div>
        <div className="hidden lg:grid place-items-center h-72 w-72 mx-auto rounded-full border border-primary/40 bg-primary/10 relative" aria-hidden="true">
          <div className="absolute inset-7 rounded-full border border-primary/30" />
          {isOverview ? <Compass className="w-28 h-28 text-primary" strokeWidth={1} /> : page === "incubator-program" ? <Sparkles className="w-28 h-28 text-primary" strokeWidth={1} /> : <Rocket className="w-28 h-28 text-primary" strokeWidth={1} />}
        </div>
      </div>
    </section>

    <section className="container mx-auto px-4 md:px-6 py-16 md:py-20"><p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl">{data.intro}</p></section>

    {data.cards.length > 0 && <section className="bg-secondary py-20"><div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-7">
      {data.cards.map((card, i) => <article key={card.slug} className="bg-background border border-border rounded-sm p-8 md:p-10 shadow-sm flex flex-col">
        <div className="w-14 h-14 rounded-sm bg-primary/10 text-primary grid place-items-center mb-7">{i === 0 ? <Sparkles size={30} /> : <Rocket size={30} />}</div>
        <h2 className="font-serif font-bold text-3xl mb-4">{card.title}</h2><p className="text-muted-foreground leading-relaxed mb-7">{card.description}</p>
        <div className="flex flex-wrap gap-2 mb-9">{card.focusAreas.map(focus => <span key={focus} className="bg-secondary text-foreground text-sm px-3 py-2 rounded-full">{focus}</span>)}</div>
        <div className="mt-auto flex flex-wrap gap-3"><Link href={paths[card.slug]} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 font-semibold rounded-sm">{t("programs.readMore")}<ArrowRight size={17} className="rtl:rotate-180" /></Link><Link href="/contact" className="inline-flex items-center px-5 py-3 border border-border font-semibold rounded-sm">{t("programs.apply")}</Link></div>
      </article>)}
    </div></section>}

    {data.sections.map((section, index) => <section key={`${section.heading}-${index}`} className={index % 2 ? "bg-secondary py-16 md:py-20" : "bg-background py-16 md:py-20"}>
      <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-[0.42fr_0.58fr] gap-10 lg:gap-20">
        <div><span className="text-primary text-sm font-bold tracking-widest">{String(index + 1).padStart(2, "0")}</span><h2 className="font-serif text-3xl md:text-4xl font-bold mt-3">{section.heading}</h2><p className="text-muted-foreground leading-relaxed mt-5">{section.description}</p></div>
        {section.items.length > 0 && <div className="grid sm:grid-cols-2 gap-3">{section.items.map((item, itemIndex) => <div key={itemIndex} className="bg-background border border-border rounded-sm p-5 flex gap-3 items-start"><span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary grid place-items-center"><Check size={16} /></span><span className="leading-relaxed">{item}</span></div>)}</div>}
      </div>
    </section>)}
    <section className="bg-foreground text-white py-20 text-center"><div className="container mx-auto px-4 max-w-2xl"><h2 className="font-serif font-bold text-3xl md:text-4xl">{t("programs.ready")}</h2><p className="text-white/70 mt-4">{t("programs.readyDesc")}</p><div className="flex flex-wrap justify-center gap-3 mt-8"><Link href="/contact" className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-sm">{t("programs.apply")}</Link><Link href="/contact" className="border border-white/50 font-semibold px-6 py-3 rounded-sm">{t("programs.consult")}</Link></div></div></section>
  </main>;
}
