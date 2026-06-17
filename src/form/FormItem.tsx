import { useMemo, type ReactNode } from "react";
import type { FormItemProps, GetChild, ViewerProps, Viewers, WithChildren } from "./form-react";
import type { ContextDom, ExtraDom, ParamsDom, VariantsDom } from "./form.model";
import { getFormItemWithChildren } from "./getFormItem";

type Children = { children: Record<string, ReactNode> }

export const FormItemHOC = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom<TypeNames>,
  Extra extends ExtraDom,
  Context extends ContextDom,
  ExtraView extends ExtraDom = Extra,
>(
  viewers: Viewers<TypeNames, Params, Variants, WithChildren<Extra, ExtraView>, Context, string>,
  useUpdatedViewProps: <K extends TypeNames>(
    props: ViewerProps<Params, Variants, K, ExtraView & Children, Context>,
  ) => ViewerProps<Params, Variants, K, Extra & Children, Context>,
) => {
  const { FormItem: useFormItem, childrenInstances } = getFormItemWithChildren<
    TypeNames,
    Params,
    Variants,
    WithChildren<Extra, ExtraView>,
    ExtraView & Children,
    Context,
    string
  >(viewers, useUpdatedViewProps)

  const FormItem = <K extends TypeNames>({
    viewProps: { extra, ctx, formItem, variant },
    renderCard,
  }: FormItemProps<
    Params,
    Variants,
    K,
    { children: ExtraView; view: ExtraView & GetChild },
    Context
  >) => {
    const newExtra = useMemo((): ExtraView & Children => {
      const children = Object.fromEntries<ReactNode>(
        childrenInstances({ extra, formItem }).map((suffix: string) => [suffix, extra.getChild(suffix)]),
      )
      return { ...extra, children }
    }, [extra, formItem])

    const props = useMemo(() => {
      return { renderCard, viewProps: { ctx, formItem, variant, extra: newExtra } }
    }, [newExtra, ctx, formItem, renderCard, variant])

    return useFormItem(props)
  }
  return FormItem
}
