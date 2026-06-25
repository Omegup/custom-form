import { useMemo, useState } from "react";
import * as lib from "./library";
import * as demo from "./moveActionsDemoHelper";
import * as types from "./moveActionsDemoTypes.t";

const formatCloneName = (name: string, n: string) => `${name} (clone${n})`;

const ItemRow = ({
  index,
  items,
  ctx,
  setItems,
}: {
  index: number;
  items: types.Item[];
  ctx: types.Ctx;
  setItems: (items: types.Item[], ctx: types.Ctx) => void;
}) => {
  const item = items[index];
  const actions = lib.makeActions<types.Item, types.Ctx>(
    {
      clone: () => [
        {
          del: false,
          name: lib.cloneName(item, items, (x) => x.name, formatCloneName),
        },
      ],
      index,
      total: 1,
      items,
      ctx,
      setItems,
      isDeleted: (x) => x.del,
      jump: ctx.deleted !== "show",
      markAsDeleted: (x, deleted) => ({ item: { ...x, del: deleted }, ctx }),
      highlight: (x, ctx) => ({ item: x, ctx: ctx.setAutoFocus(x.name) }),
    },
    {},
  );

  return item.del && ctx.deleted === "hide" ? null : (
    <demo.ItemRow item={item} actions={actions} ctx={ctx} />
  );
};

export const MoveActionsDemo = ({
  items,
  updateArgs,
}: types.DemoProps) => {
  const [autofocus, setAutofocus] = useState<lib.AutoFocusState>(null);
  const [deleted, setDeleted] = useState<"show" | "jump" | "hide">("show");
  const ctx = useMemo(
    () => demo.makeCtx(autofocus, deleted),
    [autofocus, deleted],
  );

  const setItems = (newItems: types.Item[], newCtx: types.Ctx) => {
    if (newItems !== items) updateArgs({ items: newItems });
    if (newCtx.focused !== autofocus) setAutofocus(newCtx.focused);
  };

  return (
    <demo.ListContainer>
      <demo.DeletedButtons deleted={deleted} setDeleted={setDeleted} />
      {items.map((_, index) => (
        <ItemRow
          key={index}
          index={index}
          items={items}
          ctx={ctx}
          setItems={setItems}
        />
      ))}
    </demo.ListContainer>
  );
};
