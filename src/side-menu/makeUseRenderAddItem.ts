/**
 * Slot-renderer factory — school form-edit-react `makeUseRenderAddItem`
 * (ctx/theme threading dropped; hosts pass the slot span directly).
 *
 * Same `useMenuItems` catalog as `Side` / `useSide` — school composes both
 * the sidebar and in-slot dropdown from one menu list.
 */
import type { ReactNode } from "react";
import type { FlatFormItemEditSession, ParamsDom } from "./_deps";
import type { MenuItemDefinition } from "./MenuItemDefinition.t";
import type { AddFormItemProps } from "./AddFormItem";

export const makeUseRenderAddItem =
  <TypeNames extends string, Params extends ParamsDom<TypeNames>>(
    renderAddItem: (args: AddFormItemProps<TypeNames, Params>) => ReactNode,
    useMenuItems: () => MenuItemDefinition<TypeNames, Params>[],
    random: () => string,
  ) =>
  (setAddItem: (session: FlatFormItemEditSession<TypeNames, Params>) => void) => {
    const menuItems = useMenuItems();
    return (span: { index: number; sIndex: number }): ReactNode =>
      renderAddItem({ span, menuItems, random, setAddItem });
  };
