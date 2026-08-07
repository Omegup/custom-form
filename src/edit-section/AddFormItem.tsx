/**
 * Column-slot "+ Add" dropdown — school section-edit-ui `AddFormItem` on a
 * plain toggle (no BareSelect / theme). Picking a type opens an insert
 * session at the slot's flat index (`total: 0`).
 */
import { useState } from "react";
import type { FlatFormItemEditSession, ParamsDom } from "./_deps";
import { FormMenuItem, openFormItemInsertSession } from "./_deps";
import type { MenuItemDefinition } from "./_deps";

export type AddFormItemProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  /** Slot span: concrete flat `index` (see `getFlatInsertionIndex`) + section ordinal. */
  span: { index: number; sIndex: number };
  menuItems: MenuItemDefinition<TypeNames, Params>[];
  random: () => string;
  setAddItem: (session: FlatFormItemEditSession<TypeNames, Params>) => void;
  label?: string;
};

export const AddFormItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>({
  span,
  menuItems,
  random,
  setAddItem,
  label = "+ Add item",
}: AddFormItemProps<TypeNames, Params>) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ fontSize: 12, opacity: 0.75 }}
      >
        {label}
      </button>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {menuItems.map((item) => (
            <FormMenuItem
              key={item.header.type}
              item={item}
              random={random}
              onClick={(newItem) => {
                setOpen(false);
                setAddItem(openFormItemInsertSession(newItem, span));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
