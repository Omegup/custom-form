import type { FormItemProps, ViewerProps, Viewers } from "./form-react.t";
import type { ContextDom, ExtraDom, ParamsDom, SomeFormItem, VariantsDom } from "./form.t";

export const createFormItemByChildren = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom<TypeNames>,
  ExtraView extends ExtraDom,
  ExtraChildren extends ExtraDom,
  Context extends ContextDom,
  ChildInstanceId,
>(
  viewers: Viewers<TypeNames, Params, Variants, ExtraChildren, ExtraChildren, Context, ChildInstanceId>,
  useUpdatedViewProps: <K extends TypeNames>(
    props: ViewerProps<Params, Variants, K, ExtraView, Context>,
  ) => ViewerProps<Params, Variants, K, ExtraChildren, Context>,
) => {
  const childrenInstances = (props: {
    extra: ExtraChildren
    formItem: SomeFormItem<TypeNames, Params>
  }) => {
    const { repeatChildren } = viewers[props.formItem.type]
    return repeatChildren?.(props.formItem, props.extra) ?? []
  }
  const FormItemByChildren = <K extends TypeNames>(
    props: FormItemProps<
      Params,
      Variants,
      K,
      ExtraView,
      ExtraChildren,
      Context
    >,
  ) => {
    const { renderCard, viewProps } = props
    const { viewer: Viewer } = viewers[viewProps.formItem.type]
    const updatedViewProps = useUpdatedViewProps(viewProps)
    return renderCard(<Viewer props={updatedViewProps} />, updatedViewProps)
  }
  return { FormItem: FormItemByChildren, childrenInstances }
}

