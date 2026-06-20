import { useState } from "react";
import { makeActions } from "./makeActions";
import type { MoveActions } from "./MoveActions.t";
import type { AutoFocus } from "./autofocus.t";
import { cloneName } from "./cloneName";

import "./animation.css";

const Button = ({
  onClick,
  children,
}: {
  onClick: (() => void) | null;
  children: React.ReactNode;
}) => {
  return (
    <button disabled={onClick === null} onClick={onClick || undefined}>
      {children}
    </button>
  );
};

const Actions = ({
  actions: { clone, down, remove, up, isDeleted, restore },
}: {
  actions: MoveActions;
}) => {
  return isDeleted && restore ? (
    <div>
      <Button onClick={restore}>Undo</Button>
    </div>
  ) : (
    <div>
      <Button onClick={clone}>Clone</Button>
      <Button onClick={remove}>Remove</Button>
      <Button onClick={up}>Up</Button>
      <Button onClick={down}>Down</Button>
    </div>
  );
};

type Item = { del: boolean; name: string };

const tClone = (name: string, n: string) => `${name} (clone${n})`;

const ItemElement = ({
  items,
  item,
  setItems,
  ctx,
  index,
}: {
  items: Item[];
  item: Item;
  ctx: Ctx;
  setItems: (items: Item[], ctx: Ctx) => void;
  index: number;
}) => {
  const actions = makeActions<Item, Ctx>(
    {
      clone: () => [
        {
          del: false,
          name: cloneName(item, items, (x) => x.name, tClone),
        },
      ],
      index,
      total: 1,
      items,
      ctx,
      setItems,
      isDeleted: (x) => x.del,
      markAsDeleted: (x, deleted) => ({
        item: { ...x, del: deleted },
        ctx,
      }),
      highlight: (x, ctx) => ({
        item: x,
        ctx: ctx.setAutoFocus(x.name),
      }),
    },
    {},
  );
  const focused = ctx.autoFocused(item.name);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        animation:
          focused === null ? undefined : `pulse${focused ? 1 : 2} .2s 2`,
      }}
    >
      <span style={{ textDecoration: item.del ? "line-through" : '', flex: 1 }}>
        {item.name}
      </span>
      <Actions actions={actions} />
    </div>
  );
};

type Ctx = AutoFocus<
  { autofocus: { id: string; value: boolean } | null },
  boolean
>;
export const MoveActionsTest = () => {
  const [items, setItems] = useState<Item[]>([{ del: false, name: "Item 1" }]);
  const [autofocus, setAutofocus] = useState<{
    id: string;
    value: boolean;
  } | null>(null);
  const setAutoFocus = (id?: string): Ctx => ({
    ...ctx,
    autofocus: id ? { id, value: !autofocus?.value } : null,
  });
  const ctx: Ctx = {
    setAutoFocus,
    autofocus,
    autoFocused: (id) => (autofocus?.id === id ? autofocus.value : null),
  };

  return (
    <div>
      {items.map((item, index) => (
        <ItemElement
          key={index}
          items={items}
          item={item}
          ctx={ctx}
          setItems={(newItems, ctx) => {
            if (newItems !== items) setItems(newItems);
            if (ctx.autofocus !== autofocus) setAutofocus(ctx.autofocus);
          }}
          index={index}
        />
      ))}
    </div>
  );
};
