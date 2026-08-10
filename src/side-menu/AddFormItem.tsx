/**
 * Column-slot "+ Add" dropdown — school section-edit-ui `AddFormItem` logic
 * (open/close + insert session). Host owns toggle/menu chrome via `render`.
 */
import { useState, type ReactNode } from "react";
import type { FlatFormItemEditSession, ParamsDom } from "./_deps";
import { openFormItemInsertSession } from "./_deps";
import { createBlankFormItem } from "./createBlankFormItem";
import type { MenuItemDefinition } from "./MenuItemDefinition.t";

export type AddFormItemRenderArgs = {
  open: boolean;
  label: string;
  toggle: () => void;
  items: {
    key: string;
    title: string;
    icon?: ReactNode;
    onSelect: () => void;
  }[];
};

/** Slot wiring the factory can fill — host adds `label` when rendering `AddFormItem`. */
export type AddFormItemSlotArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  /** Slot span: concrete flat `index` (see `getFlatInsertionIndex`) + section ordinal. */
  span: { index: number; sIndex: number };
  menuItems: MenuItemDefinition<TypeNames, Params>[];
  random: () => string;
  setAddItem: (session: FlatFormItemEditSession<TypeNames, Params>) => void;
};

export type AddFormItemArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = AddFormItemSlotArgs<TypeNames, Params> & {
  /** Host-owned control copy (e.g. demo `"+ Add item"`). */
  label: string;
};

export type AddFormItemProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = AddFormItemArgs<TypeNames, Params> & {
  render: (args: AddFormItemRenderArgs) => ReactNode;
};

export const AddFormItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>({
  span,
  menuItems,
  random,
  setAddItem,
  label,
  render,
}: AddFormItemProps<TypeNames, Params>) => {
  const [open, setOpen] = useState(false);
  return render({
    open,
    label,
    toggle: () => setOpen((v) => !v),
    items: menuItems.map((item) => ({
      key: item.header.type,
      title: item.title,
      icon: item.icon,
      onSelect: () => {
        setOpen(false);
        setAddItem(
          openFormItemInsertSession(
            createBlankFormItem(item, random),
            span,
          ),
        );
      },
    })),
  });
};
