import { Fragment, useMemo, type ReactElement } from "react";
import type { FormItemProps, ViewerProps, Viewers } from "./form-react.t";
import type {
  ContextDom,
  ExtraDom,
  ParamsDom,
  SomeFormItem,
  VariantsDom,
} from "./form.t";
import { createFormItemByChildren } from "./createFormItemByChildren";

type Children = { children: ReactElement[] };
type GetChild = { getChild: (suffix: string, index: number) => React.ReactNode };

export const createFormItemByGetChild = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom<TypeNames>,
  Extra extends ExtraDom,
  Context extends ContextDom,
>(
  viewers: Viewers<
    TypeNames,
    Params,
    Variants,
    Extra & Children,
    Extra,
    Context,
    string
  >,
  useUpdatedViewProps: <K extends TypeNames>(
    props: ViewerProps<Params, Variants, K, Extra & Children, Context>,
  ) => ViewerProps<Params, Variants, K, Extra & Children, Context> = (x) => x,
) => {
  const { FormItem: useFormItem } = createFormItemByChildren<
    TypeNames,
    Params,
    Variants,
    Extra & Children,
    Extra & Children,
    Extra,
    Context,
    string
  >(viewers, useUpdatedViewProps);

  const childSuffixes = (
    extra: Extra & GetChild,
    formItem: SomeFormItem<TypeNames, Params>,
  ) => {
    const { repeatChildren } = viewers[formItem.type];
    return repeatChildren?.(formItem, extra) ?? [];
  };

  const FormItem = <K extends TypeNames>({
    viewProps: { extra, ctx, formItem, variant },
    renderCard,
  }: FormItemProps<
    Params,
    Variants,
    K,
    Extra & GetChild,
    Extra & Children,
    Context
  >) => {
    const newExtra = useMemo((): Extra & Children => {
      const children = childSuffixes(extra, formItem).map((suffix, i) => (
        <Fragment key={suffix}>{extra.getChild(suffix, i)}</Fragment>
      ));
      return { ...extra, children };
    }, [extra, formItem]);

    const props = useMemo(
      () => ({
        renderCard,
        viewProps: { ctx, formItem, variant, extra: newExtra },
      }),
      [newExtra, ctx, formItem, renderCard, variant],
    );

    return useFormItem(props);
  };
  return FormItem;
};
