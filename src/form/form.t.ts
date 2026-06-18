import type { Branded } from './branded.t'

export type TheParams<Params> = Branded<Params, 'params'>
export type ParamsDom<K extends string, Param = {}> = TheParams<Record<K, Param>>
export type ContextDom = Branded<unknown, 'context'>
export type TheVariants<Variants> = Branded<Variants, 'variants'>
export type VariantsDom<K extends string, T = {}> = TheVariants<Record<K, T>>
export type ExtraDom = Branded<unknown, 'viewer-extra'>
export type ViewExtraKeys = 'view' | 'children'

export type TypedFormItem<out Params extends ParamsDom<K>, out K extends string> = {
  id: string
  type: K
  params: Params[K]
  deleted: boolean
}

export type SomeFormItem<TypeNames extends string, Params extends ParamsDom<TypeNames>> = {
  [K in TypeNames]: TypedFormItem<Params, K>
}[TypeNames]

export type SectionDom = { id: string; deleted: boolean }


