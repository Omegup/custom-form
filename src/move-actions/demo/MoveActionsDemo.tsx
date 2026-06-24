import { useMemo, useState } from "react";
import { cloneName, makeActions } from "./library";
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
  const actions = makeActions<types.Item, types.Ctx>(
    {
      clone: () => [
        {
          del: false,
          name: cloneName(item, items, (x) => x.name, formatCloneName),
        },
      ],
      index,
      total: 1,
      items,
      ctx,
      setItems,
      isDeleted: (x) => x.del,
      markAsDeleted: (x, deleted) => ({ item: { ...x, del: deleted }, ctx }),
      highlight: (x, ctx) => ({ item: x, ctx: ctx.setAutoFocus(x.name) }),
    },
    {},
  );

  return <demo.ItemRow item={item} actions={actions} ctx={ctx} />;
};

export type MoveActionsDemoProps = {
  items: types.Item[];
  updateArgs: (patch: Partial<types.StoryArgs>) => void;
};

export const MoveActionsDemo = ({
  items,
  updateArgs,
}: MoveActionsDemoProps) => {
  const [autofocus, setAutofocus] = useState<types.AutoFocusState>(null);
  const ctx = useMemo(() => demo.makeCtx(autofocus), [autofocus]);

  const setItems = (newItems: types.Item[], newCtx: types.Ctx) => {
    if (newItems !== items) updateArgs({ items: newItems });
    if (newCtx.autofocus !== autofocus) setAutofocus(newCtx.autofocus);
  };

  return (
    <demo.ListContainer>
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
