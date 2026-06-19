import type { Indexed } from "../Recursive.t";
import type { ParamsDom } from "../form";
import type { RecursiveFormItem } from "./RecursiveFormItem.t";

export type SectionDom = { id: string; deleted: boolean }

export type SectionWithItems<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> = Indexed & {
  header: SectionConfig
  items: RecursiveFormItem<TypeNames, Params>[][]
}

