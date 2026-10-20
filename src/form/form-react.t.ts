import type React from "react";
import type { ContextDom, ExtraDom, ParamsDom, TypedFormItem, VariantsDom } from "./form.t";

export type GetChild = { getChild: (suffix: string, index: number) => React.ReactNode }

export type Children = { children: React.ReactElement[] }


export type WithChildren<Extra, ExtraView = Extra> = {
  view: Extra & Children
  children: ExtraView
}
export type WithGetChild<Extra> = {
  view: Extra & GetChild
  children: Extra
}

export type Viewer<
  in Params extends ParamsDom<K>,
  in Variants extends VariantsDom,
  in K extends string,
  in Extra extends ExtraDom,
  in Context extends ContextDom,
> = (props: {
  props: ViewerProps<Params, Variants, K, Extra, Context>
}) => React.ReactNode

export type ViewerProps<
  out Params extends ParamsDom<K>,
  out Variants extends VariantsDom,
  out K extends string,
  out Extra extends ExtraDom,
  out Context extends ContextDom,
> = {
  formItem: TypedFormItem<Params, K>
  ctx: Context
  extra: Extra
  variant: Variants
}

export type Viewers<
  in TypeNames extends string,
  in Params extends ParamsDom<TypeNames>,
  in Variants extends VariantsDom,
  in ExtraView extends ExtraDom,
  in ExtraChildren extends ExtraDom,
  in Context extends ContextDom,
  out ChildInstanceId,
> = {
  [K in TypeNames]: {
    viewer: Viewer<Params, Variants, K, ExtraView, Context>
    repeatChildren?: (
      formItem: TypedFormItem<Params, K>,
      extra: ExtraChildren,
    ) => ChildInstanceId[]
  }
}

export type FormItemProps<
  in out Params extends ParamsDom<K>,
  in out Variants extends VariantsDom,
  in out K extends string,
  out ExtraView extends ExtraDom,
  in ExtraChildren extends ExtraDom,
  Context extends ContextDom,
> = {
  renderCard: (
    view: React.ReactNode,
    viewProps: ViewerProps<Params, Variants, K, ExtraChildren, Context>,
  ) => React.ReactNode
  viewProps: ViewerProps<Params, Variants, K, ExtraView, Context>
}

export type RenderCard<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Extra extends ExtraDom,
  Context extends ContextDom,
> = <K extends TypeNames>(
  view: React.ReactNode,
  viewProps: ViewerProps<Params, Variants, K, Extra, Context>,
) => React.ReactNode
