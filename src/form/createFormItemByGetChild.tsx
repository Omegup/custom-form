import { Fragment, useMemo, type ReactElement, type ReactNode } from "react";
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
type GetChild = { getChild: (suffix: string, index: number) => ReactNode };

/**
 * School `FormItemHOC` — `Extra` is what viewers receive; `ExtraView` is what
 * the host passes (e.g. `StrictViewerMethods` impRef before
 * `getUseImpRefViewProps` swaps it for the internal `ViewerMethods` ref).
 *
 * `useUpdatedViewProps` is required. When host Extra already matches viewer
 * Extra, use {@link createFormItemByGetChildPlain} instead of passing identity.
 */
export const createFormItemByGetChild = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Extra extends ExtraDom,
  Context extends ContextDom,
  ExtraView extends ExtraDom = Extra,
>(
  viewers: Viewers<
    TypeNames,
    Params,
    Variants,
    Extra & Children,
    ExtraView,
    Context,
    string
  >,
  useUpdatedViewProps: <K extends TypeNames>(
    props: ViewerProps<Params, Variants, K, ExtraView & Children, Context>,
  ) => ViewerProps<Params, Variants, K, Extra & Children, Context>,
) => {
  const { FormItem: useFormItem } = createFormItemByChildren<
    TypeNames,
    Params,
    Variants,
    ExtraView & Children,
    Extra & Children,
    ExtraView,
    Context,
    string
  >(viewers, useUpdatedViewProps);

  const childSuffixes = (
    extra: ExtraView & GetChild,
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
    ExtraView & GetChild,
    Extra & Children,
    Context
  >) => {
    const newExtra = useMemo((): ExtraView & Children => {
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

/**
 * Identity path — locks `ExtraView = Extra` so `(x) => x` is sound without a cast.
 * Use when the host already passes the same bag viewers consume.
 */
export const createFormItemByGetChildPlain = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
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
) =>
  createFormItemByGetChild<TypeNames, Params, Variants, Extra, Context, Extra>(
    viewers,
    (x) => x,
  );
