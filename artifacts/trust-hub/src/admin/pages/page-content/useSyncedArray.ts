import type { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";

// About/Services/Workspace store one array (values, list, types, faqs) per
// locale. The editor shows one locale at a time (EN/AR tabs), but add/remove
// must apply to both locales together — otherwise it's easy to end up with
// 3 English "values" cards and 2 Arabic ones, which the public page renders
// positionally (index 0 EN next to index 0 AR would silently misalign).
export function useSyncedArray<TFormValues extends FieldValues, TItem>(
  form: UseFormReturn<TFormValues>,
  enPath: Path<TFormValues>,
  arPath: Path<TFormValues>,
  makeEmpty: () => TItem,
) {
  const items = (form.watch(enPath) as unknown as TItem[]) ?? [];

  const add = () => {
    const en = (form.getValues(enPath) as unknown as TItem[]) ?? [];
    const ar = (form.getValues(arPath) as unknown as TItem[]) ?? [];
    form.setValue(enPath, [...en, makeEmpty()] as PathValue<TFormValues, Path<TFormValues>>);
    form.setValue(arPath, [...ar, makeEmpty()] as PathValue<TFormValues, Path<TFormValues>>);
  };

  const remove = (index: number) => {
    const en = (form.getValues(enPath) as unknown as TItem[]) ?? [];
    const ar = (form.getValues(arPath) as unknown as TItem[]) ?? [];
    form.setValue(enPath, en.filter((_, i) => i !== index) as PathValue<TFormValues, Path<TFormValues>>);
    form.setValue(arPath, ar.filter((_, i) => i !== index) as PathValue<TFormValues, Path<TFormValues>>);
  };

  return { items, add, remove };
}
