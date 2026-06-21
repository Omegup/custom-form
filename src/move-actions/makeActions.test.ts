import { describe, expect, it, vi } from "vitest";
import { makeActions } from "./makeActions";
import type { AutoFocus } from "./autofocus.t";

type Item = { id: string; deleted: boolean };
type Ctx = AutoFocus<{ tag: string }, string>;

const makeCtx = (tag: string): Ctx => ({
  tag,
  setAutoFocus: (id) => makeCtx(id ?? tag),
  autoFocused: (id) => id,
});

describe("makeActions", () => {
  it("moves an item down when not at the end", () => {
    const items: Item[] = [
      { id: "a", deleted: false },
      { id: "b", deleted: false },
    ];
    const setItems = vi.fn();
    const actions = makeActions<Item, Ctx>(
      {
        clone: () => [{ id: "c", deleted: false }],
        index: 0,
        total: 1,
        items,
        ctx: makeCtx("a"),
        setItems,
        isDeleted: (x) => x.deleted,
        markAsDeleted: (x, deleted) => ({ item: { ...x, deleted }, ctx: makeCtx(x.id) }),
        highlight: (x, ctx) => ({ item: x, ctx }),
      },
      {},
    );

    actions.down?.();
    expect(setItems).toHaveBeenCalledWith(
      [
        { id: "b", deleted: false },
        { id: "a", deleted: false },
      ],
      expect.any(Object),
    );
  });
});
