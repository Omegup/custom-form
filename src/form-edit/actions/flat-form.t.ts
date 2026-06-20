import type { ParamsDom, SomeFormItem, } from "./_deps";
import type { SectionDom } from "./section.t";

export type FlatFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> =
  | { section: SectionConfig }
  | { item: SomeFormItem<TypeNames, Params>; n: number }
  | { end: null };

export type FlatFormItems<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> = FlatFormItem<TypeNames, Params, SectionConfig>[];
