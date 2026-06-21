/**
 * Render one edit-mode form item through the viewers registry.
 * Ported from school form-edit-react/renderEditFormItem.tsx.
 */
import type {
  ContextDom,
  ExtraDom,
  ParamsDom,
  ReactNode,
  RecursiveFormItem,
  RenderCard,
  TheVariants,
  Viewers,
  WithChildren,
} from "./_deps";
import { FormItemHOC } from "./_deps";
import type { EditExtra } from "./types";

type RenderFormItemArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends TheVariants<Record<TypeNames, string>>,
  Extra extends ExtraDom,
  Context extends ContextDom,
  Meta extends import("./_deps").MetaDom,
> = {
  extra: { items: (id: string) => Extra };
  renderCard: RenderCard<
    TypeNames,
    Params,
    Variants,
    Extra & EditExtra,
    Context
  >;
  item: RecursiveFormItem<TypeNames, Params, Meta>;
  children: ReactNode;
  variants: Variants;
  ctx: Context;
  parentDeleted: boolean;
  index: number;
};

export const createRenderEditFormItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends TheVariants<Record<TypeNames, string>>,
  Extra extends ExtraDom,
  Context extends ContextDom,
  Meta extends import("./_deps").MetaDom,
>(
  viewers: Viewers<
    TypeNames,
    Params,
    Variants,
    WithChildren<Extra & EditExtra>,
    Context,
    string
  >,
) => {
  const FormItem = FormItemHOC<
    TypeNames,
    Params,
    Variants,
    Extra & EditExtra,
    Context
  >(viewers, (x) => x);

  return (
    args: RenderFormItemArgs<
      TypeNames,
      Params,
      Variants,
      Extra,
      Context,
      Meta
    >,
  ) => {
    const {
      item,
      children,
      ctx,
      extra,
      parentDeleted,
      renderCard,
      variants,
      index,
    } = args;
    const formItem = item.header;
    return (
      <FormItem
        viewProps={{
          ctx,
          extra: {
            ...extra.items(formItem.id),
            index,
            getChild: () => children,
            parentDeleted,
          },
          formItem,
          variant: variants[formItem.type],
        }}
        renderCard={renderCard}
      />
    );
  };
};

export type { EditExtra };
