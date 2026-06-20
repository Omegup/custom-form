import type { ParamsDom, RecursiveFormItem, SectionDom } from "./_deps";
import type { FlatFormItems } from "./flat-form.t";

export const customFlat = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  FormItem,
  SectionConfig extends SectionDom,
>(
  mapItems: (
    items: () => FormItem[],
    q: RecursiveFormItem<TypeNames, Params>,
  ) => FormItem[],
  mapSlot: (items: FormItem[]) => FormItem[],
  mapSection: (items: () => FormItem[], s: SectionConfig) => FormItem[],
) => {
  const formItems = (slot: RecursiveFormItem<TypeNames, Params>[]) =>
    mapSlot(slot.flatMap(formItem));
  const formItem = (
    formItem: RecursiveFormItem<TypeNames, Params>,
  ): FormItem[] =>
    mapItems(() => formItem.children.flatMap(formItems), formItem);
  const section = (section: {
    header: SectionConfig;
    items: RecursiveFormItem<TypeNames, Params>[][];
  }): FormItem[] =>
    mapSection(() => section.items.flatMap(formItems), section.header);
  return { formItem, formItems, section };
};

export const flatten = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>() =>
  customFlat<
    TypeNames,
    Params,
    FlatFormItems<TypeNames, Params, SectionConfig>[0],
    SectionConfig
  >(
    (items, q) => [{ item: q.header, n: q.children.length }, ...items()],
    (items) => [...items, { end: null }],
    (items, s) => [{ section: s }, ...items().slice(0, -1)],
  );
