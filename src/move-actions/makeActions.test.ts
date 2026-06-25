import { describe, expect, it, vi } from "vitest";
import { makeActions } from "./makeActions";
import type { AutoFocus } from "./autofocus.t";

type Item = { id: string; deleted: boolean };
type Ctx = AutoFocus<{ tag: string }, string>;

const item = (id: string, deleted = false): Item => ({ id, deleted });

const makeCtx = (tag: string): Ctx => ({
  tag,
  setAutoFocus: (id) => makeCtx(id ?? tag),
  autoFocused: (id) => id,
});

const ctxTag = (tag: string) =>
  expect.objectContaining({
    tag,
    setAutoFocus: expect.any(Function),
    autoFocused: expect.any(Function),
  });

const setup = (
  {
    items,  
    index,
    total = 1,
    min,
    clone = () => [item("clone")],
    setToRemove,
  }: {
    items: Item[];
    index: number;
    total?: number;
    min?: number;
    clone?: () => Item[];
    setToRemove?: (remove: () => void, item: Item) => () => void;
  },
  move?: Parameters<typeof makeActions<Item, Ctx>>[1],
) => {
  const setItems = vi.fn();
  const actions = makeActions<Item, Ctx>(
    {
      jump: true,
      items,
      index,
      total,
      min,
      ctx: makeCtx(items[index]!.id),
      setItems,
      clone,
      isDeleted: (x) => x.deleted,
      markAsDeleted: (x, deleted) => ({
        item: { ...x, deleted },
        ctx: makeCtx(x.id),
      }),
      highlight: (x, ctx) => ({ item: x, ctx: ctx.setAutoFocus(x.id) }),
      setToRemove,
    },
    move ?? {},
  );
  return { actions, setItems };
};

describe("makeActions", () => {
  it("reports whether the item at index is deleted", () => {
    const active = setup({ items: [item("a"), item("b")], index: 0 });
    const deleted = setup({ items: [item("a", true)], index: 0 });

    expect(active.actions.isDeleted).toBe(false);
    expect(deleted.actions.isDeleted).toBe(true);
  });

  describe("down", () => {
    it("swaps with the next item", () => {
      const { actions, setItems } = setup({
        items: [item("a"), item("b")],
        index: 0,
      });

      actions.down!();
      expect(setItems).toHaveBeenCalledOnce();
      expect(setItems).toHaveBeenCalledWith(
        [item("b"), item("a")],
        ctxTag("a"),
      );
    });

    it("skips deleted items below", () => {
      const { actions, setItems } = setup({
        items: [item("a"), item("gap", true), item("c")],
        index: 0,
      });

      actions.down!();
      expect(setItems).toHaveBeenCalledWith(
        [item("gap", true), item("c"), item("a")],
        ctxTag("a"),
      );
    });

    it("is null at the end or when only deleted items remain below", () => {
      expect(
        setup({ items: [item("a"), item("b")], index: 1 }).actions.down,
      ).toBeNull();
      expect(
        setup({ items: [item("a"), item("b", true)], index: 0 }).actions.down,
      ).toBeNull();
    });
  });

  describe("up", () => {
    it("swaps with the previous item", () => {
      const { actions, setItems } = setup({
        items: [item("a"), item("b")],
        index: 1,
      });

      actions.up!();
      expect(setItems).toHaveBeenCalledOnce();
      expect(setItems).toHaveBeenCalledWith(
        [item("b"), item("a")],
        ctxTag("b"),
      );
    });

    it("skips deleted items above", () => {
      const { actions, setItems } = setup({
        items: [item("a"), item("gap", true), item("c")],
        index: 2,
      });

      actions.up!();
      expect(setItems).toHaveBeenCalledWith(
        [item("c"), item("a"), item("gap", true)],
        ctxTag("c"),
      );
    });

    it("is null at the top or when only deleted items remain above", () => {
      expect(
        setup({ items: [item("a"), item("b")], index: 0 }).actions.up,
      ).toBeNull();
      expect(
        setup({ items: [item("a", true), item("b")], index: 1 }).actions.up,
      ).toBeNull();
    });
  });

  describe("clone", () => {
    it("inserts clones after the current block and focuses the first clone", () => {
      const { actions, setItems } = setup({
        items: [item("a"), item("b")],
        index: 0,
        clone: () => [item("c")],
      });

      actions.clone!();
      expect(setItems).toHaveBeenCalledOnce();
      expect(setItems).toHaveBeenCalledWith(
        [item("a"), item("c"), item("b")],
        ctxTag("c"),
      );
    });

    it("inserts every clone returned by the clone callback", () => {
      const { actions, setItems } = setup({
        items: [item("a")],
        index: 0,
        clone: () => [item("c1"), item("c2")],
      });

      actions.clone!();
      expect(setItems).toHaveBeenCalledWith(
        [item("a"), item("c1"), item("c2")],
        ctxTag("c1"),
      );
    });
  });

  describe("remove", () => {
    it("marks the item deleted when enough active items would remain", () => {
      const { actions, setItems } = setup({
        items: [item("a"), item("b")],
        index: 0,
        min: 1,
      });

      actions.remove!();
      expect(setItems).toHaveBeenCalledOnce();
      expect(setItems).toHaveBeenCalledWith(
        [item("a", true), item("b")],
        ctxTag("a"),
      );
    });

    it("is null when removal would drop below min", () => {
      expect(
        setup({ items: [item("a")], index: 0, min: 1 }).actions.remove,
      ).toBeNull();
    });

    it("wraps the remove callback with setToRemove", () => {
      const onRemove = vi.fn();
      const { actions, setItems } = setup({
        items: [item("a"), item("b")],
        index: 0,
        min: 1,
        setToRemove: (cb, removedItem) => {
          expect(removedItem).toEqual(item("a"));
          return () => {
            onRemove();
            cb();
          };
        },
      });

      actions.remove!();
      expect(onRemove).toHaveBeenCalledOnce();
      expect(setItems).toHaveBeenCalledWith(
        [item("a", true), item("b")],
        ctxTag("a"),
      );
    });
  });

  describe("restore", () => {
    it("clears the deleted flag on the item at index", () => {
      const { actions, setItems } = setup({
        items: [item("a", true), item("b")],
        index: 0,
      });

      actions.restore!();
      expect(setItems).toHaveBeenCalledOnce();
      expect(setItems).toHaveBeenCalledWith(
        [item("a"), item("b")],
        ctxTag("a"),
      );
    });
  });

  describe("multi-item blocks", () => {
    it("moves a block of items together", () => {
      const { actions, setItems } = setup({
        items: [item("a"), item("b"), item("c"), item("d")],
        index: 1,
        total: 2,
      });

      actions.down!();
      expect(setItems).toHaveBeenCalledWith(
        [item("a"), item("d"), item("b"), item("c")],
        ctxTag("b"),
      );
    });
  });
});
