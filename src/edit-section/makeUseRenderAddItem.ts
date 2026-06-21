/**
 * Hook factory for per-column "add item" render slots.
 * Ported from school form-edit-react/useRenderAddItem.ts.
 */
import type { ContextDom, ParamsDom, ReactNode } from "./_deps";
import type { MenuItemDefinition } from "./_deps";
import type { AddFormItemProps, EditFormItem } from "./types";

export const makeUseRenderAddItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends ContextDom,
  Meta extends import("./_deps").MetaDom,
>(
  renderAddItem: (
    args: AddFormItemProps<TypeNames, Params, Context, Meta>,
  ) => ReactNode,
  useMenuItems: () => MenuItemDefinition<TypeNames, Params>[],
  random: () => string,
) =>
  (setAddItem: (q: EditFormItem<TypeNames, Params, Meta>) => void, ctx: Context) => {
    const menuItems = useMenuItems();
    return (item: AddFormItemProps<TypeNames, Params, Context, Meta>["item"]) =>
      renderAddItem({
        item,
        menuItems,
        random,
        setAddItem,
        ctx,
      });
  };
