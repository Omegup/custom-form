import type { Branded } from './branded'

export type ParamsDom<K extends string, Param = {}> = Branded<Record<K, Param>, 'params'>
export type ContextDom = Branded<unknown, 'context'>
export type VariantsDom<K extends string, T = {}> = Branded<Record<K, T>, 'variants'>
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


