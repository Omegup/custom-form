import type { ContextDom, ExtraDom, ParamsDom, TypedFormItem, VariantsDom, ViewExtraKeys } from "./form.model";

export type GetChild = { getChild: (suffix: string) => React.ReactNode }
export type WithChildren<Extra, ExtraView = Extra> = {
  view: Extra & { children: Record<string, React.ReactNode> }
  children: ExtraView
}
export type WithGetChild<Extra> = {
  view: Extra & GetChild
  children: Extra
}

export type Viewer<
  in Params extends ParamsDom<K>,
  in Variants extends VariantsDom<K>,
  in K extends string,
  in Extra extends ExtraDom,
  in Context extends ContextDom,
> = (props: {
  props: ViewerProps<Params, Variants, K, Extra, Context>
}) => React.ReactNode

export type ViewerProps<
  out Params extends ParamsDom<K>,
  out Variants extends VariantsDom<K>,
  out K extends string,
  out Extra extends ExtraDom,
  out Context extends ContextDom,
> = {
  formItem: TypedFormItem<Params, K>
  ctx: Context
  extra: Extra
  variant: Variants[K]
}

export type Viewers<
  in TypeNames extends string,
  in Params extends ParamsDom<TypeNames>,
  in Variants extends VariantsDom<TypeNames>,
  in Extra extends Record<'view' | 'children', ExtraDom>,
  in Context extends ContextDom,
  out ChildInstanceId,
> = {
  [K in TypeNames]: {
    viewer: Viewer<Params, Variants, K, Extra['view'], Context>
    repeatChildren?: (
      formItem: TypedFormItem<Params, K>,
      extra: Extra['children'],
    ) => ChildInstanceId[]
  }
}

export type FormItemProps<
  Params extends ParamsDom<K>,
  Variants extends VariantsDom<K>,
  K extends string,
  Extra extends Record<ViewExtraKeys, ExtraDom>,
  Context extends ContextDom,
> = {
  renderCard: (
    view: React.ReactNode,
    viewProps: ViewerProps<Params, Variants, K, Extra['children'], Context>,
  ) => React.ReactNode
  viewProps: ViewerProps<Params, Variants, K, Extra['view'], Context>
}
