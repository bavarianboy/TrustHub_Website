import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminUpdateProgramPageContentBody } from "@workspace/api-zod";
import { useAdminGetProgramPageContent, useAdminUpdateProgramPageContent, getAdminGetProgramPageContentQueryKey, getGetProgramPageContentQueryKey } from "@workspace/api-client-react";
import type { AdminProgramPageContent, ProgramPage } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type Locale = "en" | "ar";
const names: Record<ProgramPage, string> = { programs: "Programs Overview", "incubator-program": "Incubator Program", "accelerator-program": "Accelerator Program" };
const blankSection = () => ({ heading: "", description: "", items: [] as string[] });

export function ProgramEditor({ page }: { page: ProgramPage }) {
  const { data, isLoading, isError } = useAdminGetProgramPageContent(page);
  const update = useAdminUpdateProgramPageContent();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [draft, setDraft] = useState<AdminProgramPageContent | null>(null);
  useEffect(() => { if (data) setDraft(data); }, [data]);

  function edit(locale: Locale, change: (value: AdminProgramPageContent[Locale]) => AdminProgramPageContent[Locale]) {
    setDraft(current => current ? { ...current, [locale]: change(current[locale]) } : current);
  }
  function editSection(locale: Locale, index: number, patch: Partial<AdminProgramPageContent[Locale]["sections"][number]>) {
    edit(locale, value => ({ ...value, sections: value.sections.map((section, i) => i === index ? { ...section, ...patch } : section) }));
  }
  function addSection() { setDraft(current => current ? { en: { ...current.en, sections: [...current.en.sections, blankSection()] }, ar: { ...current.ar, sections: [...current.ar.sections, blankSection()] } } : current); }
  function removeSection(index: number) { setDraft(current => current ? { en: { ...current.en, sections: current.en.sections.filter((_, i) => i !== index) }, ar: { ...current.ar, sections: current.ar.sections.filter((_, i) => i !== index) } } : current); }
  function save() {
    if (!draft) return;
    const parsed = AdminUpdateProgramPageContentBody.safeParse(draft);
    if (!parsed.success) { toast({ title: "Please complete all content fields", variant: "destructive" }); return; }
    update.mutate({ page, data: parsed.data }, {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getAdminGetProgramPageContentQueryKey(page) });
        void queryClient.invalidateQueries({ queryKey: getGetProgramPageContentQueryKey(page) });
        toast({ title: `${names[page]} updated` });
      },
      onError: () => toast({ title: "Couldn't save changes", variant: "destructive" }),
    });
  }

  if (isError) return <p className="text-destructive">Couldn't load program content.</p>;
  if (isLoading || !draft) return <p className="text-muted-foreground">Loading…</p>;
  return <div className="max-w-4xl pb-16">
    <Link href="/pages" className="text-sm text-muted-foreground hover:text-primary">← Back to Pages</Link>
    <div className="flex flex-wrap items-center justify-between gap-4 mt-5 mb-8"><h1 className="font-serif text-2xl font-bold">Edit {names[page]}</h1><Button onClick={save} disabled={update.isPending}>Save both languages</Button></div>
    <Tabs defaultValue="en"><TabsList><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="ar">العربية</TabsTrigger></TabsList>
      {(["en", "ar"] as const).map(locale => { const value = draft[locale]; const dir = locale === "ar" ? "rtl" : "ltr"; return <TabsContent key={locale} value={locale} className="space-y-8 mt-6" dir={dir}>
        <div className="border border-border p-6 space-y-4 rounded-sm bg-background"><label className="block font-semibold">Page title<Input value={value.title} onChange={e => edit(locale, v => ({ ...v, title: e.target.value }))} /></label><label className="block font-semibold">Subtitle<Textarea value={value.subtitle} onChange={e => edit(locale, v => ({ ...v, subtitle: e.target.value }))} /></label><label className="block font-semibold">Introduction<Textarea value={value.intro} onChange={e => edit(locale, v => ({ ...v, intro: e.target.value }))} /></label></div>
        {page === "programs" && <div className="space-y-4"><h2 className="text-xl font-bold">Program cards</h2>{value.cards.map((card, i) => <div key={card.slug} className="border border-border p-5 rounded-sm bg-background space-y-3"><p className="text-sm text-muted-foreground">{card.slug}</p><label className="block">Title<Input value={card.title} onChange={e => edit(locale, v => ({ ...v, cards: v.cards.map((c, j) => j === i ? { ...c, title: e.target.value } : c) }))} /></label><label className="block">Description<Textarea value={card.description} onChange={e => edit(locale, v => ({ ...v, cards: v.cards.map((c, j) => j === i ? { ...c, description: e.target.value } : c) }))} /></label><label className="block">Focus areas (one per line)<Textarea value={card.focusAreas.join("\n")} onChange={e => edit(locale, v => ({ ...v, cards: v.cards.map((c, j) => j === i ? { ...c, focusAreas: e.target.value.split("\n").filter(Boolean) } : c) }))} /></label></div>)}</div>}
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Sections</h2><Button type="button" variant="outline" onClick={addSection}><Plus size={16} className="me-2" /> Add section to both languages</Button></div>
        {value.sections.map((section, i) => <div key={i} className="border border-border p-5 rounded-sm bg-background space-y-3"><div className="flex items-center justify-between"><span className="font-semibold">Section {i + 1}</span><Button type="button" variant="ghost" size="sm" onClick={() => removeSection(i)}><Trash2 size={16} className="me-2" /> Remove from both</Button></div><label className="block">Heading<Input value={section.heading} onChange={e => editSection(locale, i, { heading: e.target.value })} /></label><label className="block">Description<Textarea value={section.description} onChange={e => editSection(locale, i, { description: e.target.value })} /></label><label className="block">List items (one per line)<Textarea className="min-h-36" value={section.items.join("\n")} onChange={e => editSection(locale, i, { items: e.target.value.split("\n").filter(Boolean) })} /></label></div>)}
      </TabsContent>; })}
    </Tabs>
    <Button onClick={save} disabled={update.isPending} className="mt-8">Save both languages</Button>
  </div>;
}
