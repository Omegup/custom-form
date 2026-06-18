import { useState } from "react";
import { makeActions } from "./MakeActions";
import type { MoveActions } from "./MoveActions";
import type { AutoFocusCtx } from "./AutoFocus";
import { escapeRegExp } from "lodash-es";


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

const randomColor = (random: number | null) =>
  random !== null
    ? `#${Math.floor(random * 16777215)
        .toString(16)
        .padStart(6, "0")}`
    : "initial";
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
  const actions = makeActions<Item, {}, Ctx>(
    {
      clone: () => {
        const r = Math.random().toString(36).substring(2, 15);
        const pattern = new RegExp(escapeRegExp(tClone(item.name, r)).replace(r, '( \\d+)?'), 'g');

        return [
          {
            del: false,
            name: tClone(
              item.name,
              items
                .flatMap((x) => [...x.name.matchAll(pattern)])
                .map((x) => ` ${+(x[1] || 1) + 1}`)
                .reduce((a, b) => ((+b || 0) > (+a || 0) ? b : a), ""),
            ),
          },
        ];
      },
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
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        backgroundColor: randomColor(ctx.autoFocused(item.name)),
      }}
    >
      {item.del ? (
        <span style={{ textDecoration: "line-through" }}>{item.name}</span>
      ) : (
        <span>{item.name}</span>
      )}
      <Actions actions={actions} />
    </div>
  );
};

type Ctx = AutoFocusCtx<
  { autofocus: { id: string; value: number } | null },
  number
>;
export const MoveActionsTest = () => {
  const [items, setItems] = useState<Item[]>([{ del: false, name: "Item 1" }]);
  const [autofocus, setAutofocus] = useState<{
    id: string;
    value: number;
  } | null>(null);
  const setAutoFocus = (id?: string): Ctx => ({
    ...ctx,
    autofocus: id ? { id, value: Math.random() } : null,
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
