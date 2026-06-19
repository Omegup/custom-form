import type { Indexed } from "../Recursive.t";
import type { ParamsDom, SomeFormItem } from "../form/form.t";
import type { RecursiveFormItem } from "./recursive-form.t";

export type { RecursiveFormItem, RecursiveTypedFormItem } from "./recursive-form.t";

export type SectionDom = { id: string; deleted: boolean }

export type SectionWithItems<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> = Indexed & {
  header: SectionConfig
  items: RecursiveFormItem<TypeNames, Params>[][]
}

export type FlattenFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> =
  | { section: SectionConfig }
  | { item: SomeFormItem<TypeNames, Params>; n: number }
  | { end: null }

export type FlattenFormItems<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> = FlattenFormItem<TypeNames, Params, SectionConfig>[]
