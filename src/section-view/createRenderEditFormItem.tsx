/**
 * Per-item viewer dispatch for section editing — school
 * `react-packages/form-edit-react/renderEditFormItem.tsx`, wired through the
 * existing `form/createFormItemByGetChild` (`FormItemHOC`) instead of a new
 * HOC.
 *
 * `getChild` ignores the suffix `createFormItemByGetChild` passes it —
 * `children` is already the *whole* pre-rendered nested-column block built
 * by the `renderEdit` implementation's own recursion (e.g. `ColumnsEdit`),
 * matching school's `getChild: () => children`.
 */
import type {
  AutoFocus,
  Children,
  ContextDom,
  ExtraDom,
  ParamsDom,
  SectionDom,
  VariantsDom,
  Viewers,
} from "./_deps";
import { createFormItemByGetChildPlain } from "./_deps";
import type { EditExtra, RenderNodeArgs, SectionProps } from "./types";

export const createRenderEditFormItem = <
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
    Extra & EditExtra & Children,
    Extra & EditExtra,
    AutoFocus<Context, boolean>,
    string
  >,
) => {
  const FormItem = createFormItemByGetChildPlain<
    TypeNames,
    Params,
    Variants,
    Extra & EditExtra,
    AutoFocus<Context, boolean>
  >(viewers);

  return <SectionConfig extends SectionDom>(
      props: SectionProps<TypeNames, Params, Variants, SectionConfig, Context, Extra>,
    ) =>
    ({ item, children, parentDeleted, index }: RenderNodeArgs<TypeNames, Params>) => {
      const formItem = item.header;
      return (
        <FormItem
          viewProps={{
            ctx: props.ctx,
            formItem,
            variant: props.variants[formItem.type],
            extra: {
              ...props.itemExtra(formItem.id),
              index,
              parentDeleted,
              getChild: () => children,
            },
          }}
          renderCard={props.renderCard}
        />
      );
    };
};
