import type { FormItemProps, ViewerProps, Viewers } from "./form-react";
import type { ContextDom, ExtraDom, ParamsDom, SomeFormItem, VariantsDom, ViewExtraKeys } from "./form.model";

export const getFormItemWithChildren = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom<TypeNames>,
  Extra extends Record<ViewExtraKeys, ExtraDom>,
  ExtraView extends ExtraDom,
  Context extends ContextDom,
  ChildInstanceId,
>(
  viewers: Viewers<TypeNames, Params, Variants, Extra, Context, ChildInstanceId>,
  useUpdatedViewProps: <K extends TypeNames>(
    props: ViewerProps<Params, Variants, K, ExtraView, Context>,
  ) => ViewerProps<Params, Variants, K, Extra['view'], Context>,
) => {
  const childrenInstances = (props: {
    extra: Extra['children']
    formItem: SomeFormItem<TypeNames, Params>
  }) => {
    const { repeatChildren } = viewers[props.formItem.type]
    return repeatChildren?.(props.formItem, props.extra) ?? []
  }
  const FormItem = <K extends TypeNames>(
    props: FormItemProps<
      Params,
      Variants,
      K,
      Pick<Extra, 'children'> & { view: ExtraView },
      Context
    >,
  ) => {
    const { renderCard, viewProps } = props
    const { viewer: Viewer } = viewers[viewProps.formItem.type]
    const updatedViewProps = useUpdatedViewProps(viewProps)
    return renderCard(<Viewer props={updatedViewProps} />, updatedViewProps)
  }
  return { FormItem, childrenInstances }
}

