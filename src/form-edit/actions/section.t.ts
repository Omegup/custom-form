import type { ParamsDom } from "../../form";
import type { MetaDom } from "../../recursive-form/Recursive.t";
import type { RecursiveFormItem } from "../../recursive-form/RecursiveFormItem.t";

export type SectionDom = { id: string; deleted: boolean }
export type SectionMetaDom<T = unknown> = { section: T }

export type SectionWithItems<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
  SectionMeta extends SectionMetaDom,
  Meta extends MetaDom,
> = {
  meta: SectionMeta['section']
  header: SectionConfig
  items: RecursiveFormItem<TypeNames, Params, Meta>[][]
}

