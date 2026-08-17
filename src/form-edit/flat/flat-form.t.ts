import type { ParamsDom, SomeFormItem, } from "./_deps";

export type FlatFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = { item: SomeFormItem<TypeNames, Params>; n: number }
export type FlatNestedItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> =
  | { section: SectionConfig }
  | FlatFormItem<TypeNames, Params>
  | { end: null };

export type FlatFormItems<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> = FlatNestedItem<TypeNames, Params, SectionConfig>[];

export type SectionDom = { id: string; deleted: boolean };
export type SectionHeader = SectionDom & { title: string; description: string };
