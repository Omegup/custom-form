import type { Indexed, Recursive } from "../Recursive"
import type { ParamsDom, SomeFormItem, TypedFormItem } from "../form/form.t"


export type SectionDom = { id: string; deleted: boolean }

export type RecursiveFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = Recursive<SomeFormItem<TypeNames, Params>>

export type RecursiveTypedFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  K extends TypeNames,
> = Recursive<SomeFormItem<TypeNames, Params>, TypedFormItem<Params, K>>

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
