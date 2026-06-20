import type { MetaDom, ParamsDom, RecursiveFormItem } from "./_deps";

export type SectionDom = { id: string; deleted: boolean };
export type SectionMetaDom<T = unknown> = { section: T };

export type SectionWithItems<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
  SectionMeta extends SectionMetaDom,
  Meta extends MetaDom,
> = {
  meta: SectionMeta["section"];
  header: SectionConfig;
  items: RecursiveFormItem<TypeNames, Params, Meta>[][];
};
