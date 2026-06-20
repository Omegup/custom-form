/** Recursive item/section → flat markers. Inverse of consolidateSections for one subtree. */
import type { MetaDom, ParamsDom, RecursiveFormItem } from "./_deps";
import type { FlatFormItems, SectionDom } from "./_deps";

export const customFlat = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  FormItem,
  SectionConfig extends SectionDom,
  Meta extends MetaDom,
>(
  mapItems: (
    items: () => FormItem[],
    q: RecursiveFormItem<TypeNames, Params, Meta>,
  ) => FormItem[],
  mapSlot: (items: FormItem[]) => FormItem[],
  mapSection: (items: () => FormItem[], s: SectionConfig) => FormItem[],
) => {
  const formItems = (slot: RecursiveFormItem<TypeNames, Params, Meta>[]) =>
    mapSlot(slot.flatMap(formItem));
  const formItem = (
    formItem: RecursiveFormItem<TypeNames, Params, Meta>,
  ): FormItem[] =>
    mapItems(() => formItem.children.flatMap(formItems), formItem);
  const section = (section: {
    header: SectionConfig;
    items: RecursiveFormItem<TypeNames, Params, Meta>[][];
  }): FormItem[] =>
    mapSection(() => section.items.flatMap(formItems), section.header);
  return { formItem, formItems, section };
};

export const flatten = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
  Meta extends MetaDom,
>() =>
  customFlat<
    TypeNames,
    Params,
    FlatFormItems<TypeNames, Params, SectionConfig>[0],
    SectionConfig,
    Meta
  >(
    (items, q) => [{ item: q.header, n: q.children.length }, ...items()],
    (items) => [...items, { end: null }],
    (items, s) => [{ section: s }, ...items().slice(0, -1)],
  );
