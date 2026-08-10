import { describe, expect, it, vi } from "vitest";
import type { ContextDom, TheParams } from "../_deps";
import { branded } from "../_deps";
import { autofocusCtx } from "../../move-actions";
import { buildItemSectionDict } from "../flat/buildItemSectionDict";
import { consolidateSections } from "../flat/consolidate";
import type { FlatNestedItem } from "../flat/flat-form.t";
import { getFormItemMoveActions } from "./getFormItemMoveActions";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Section = {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
};

const section = (
  id: string,
  title: string,
  deleted = false,
): FlatNestedItem<TypeNames, Params, Section> => ({
  section: { id, deleted, title, description: "" },
});

const field = (
  id: string,
  name: string,
  opts: { n?: number; deleted?: boolean } = {},
): FlatNestedItem<TypeNames, Params, Section> => ({
  item: {
    id,
    type: "field",
    params: { name },
    deleted: opts.deleted ?? false,
  },
  n: opts.n ?? 0,
});

const end = (): FlatNestedItem<TypeNames, Params, Section> => ({ end: null });

const flat = (...xs: FlatNestedItem<TypeNames, Params, Section>[]) => xs;

const setup = (
  items: FlatNestedItem<TypeNames, Params, Section>[],
  itemId: string,
  jump = true,
) => {
  const setItems = vi.fn();
  const ctx = autofocusCtx(branded<Record<string, never>, "context">({}), null);
  const getActions = getFormItemMoveActions<
    TypeNames,
    Params,
    ContextDom,
    Section,
    { meta: { index: number; total: number; sIndex: number } }
  >(
    {
      items,
      setItems,
      ctx,
      sectionOfItem: buildItemSectionDict(items),
      setToRemove: () => {},
    },
    (sub) => sub,
    jump,
  );
  const sections = consolidateSections(items);
  const find = (
    nodes: (typeof sections)[0]["items"],
  ): (typeof sections)[0]["items"][0][0] | undefined => {
    for (const col of nodes) {
      for (const node of col) {
        if (node.header.id === itemId) return node;
        const nested = find(node.children);
        if (nested) return nested;
      }
    }
  };
  let target: ReturnType<typeof find>;
  for (const s of sections) {
    target = find(s.items);
    if (target) break;
  }
  if (!target) throw new Error(`item ${itemId} not found`);
  return { actions: getActions(target), setItems, target };
};

describe("getFormItemMoveActions", () => {
  describe("down — into a live panel (default i±1 step)", () => {
    it("swaps with the next live leaf", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("f2", "Email"),
      );
      const { actions, setItems } = setup(items, "f1");
      actions.down!();
      expect(setItems.mock.calls[0]![0]).toEqual(
        flat(section("s1", "Main"), field("f2", "Email"), field("f1", "Name")),
      );
    });

    it("moves a field one step down, landing right after a live panel's header", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("p1", "Panel", { n: 2 }),
        field("c1", "A"),
        end(),
        field("c2", "B"),
        end(),
      );
      const { actions, setItems } = setup(items, "f1");
      actions.down!();
      expect(setItems.mock.calls[0]![0]).toEqual(
        flat(
          section("s1", "Main"),
          field("p1", "Panel", { n: 2 }),
          field("f1", "Name"),
          field("c1", "A"),
          end(),
          field("c2", "B"),
          end(),
        ),
      );
    });

    it("jumps a soft-deleted leaf then swaps with the next live field", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("f2", "Gone", { deleted: true }),
        field("f3", "Email"),
      );
      const { actions, setItems } = setup(items, "f1");
      actions.down!();
      expect(setItems.mock.calls[0]![0]).toEqual(
        flat(
          section("s1", "Main"),
          field("f2", "Gone", { deleted: true }),
          field("f3", "Email"),
          field("f1", "Name"),
        ),
      );
    });

    it("is null when only a soft-deleted leaf remains below", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("f2", "Gone", { deleted: true }),
      );
      expect(setup(items, "f1").actions.down).toBeNull();
    });
  });

  describe("down — a soft-deleted panel is jumped as a whole (self-or-ancestor deleted)", () => {
    it("with jump: skips the whole deleted panel span, landing after it", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("p1", "Panel", { n: 2, deleted: true }),
        field("c1", "A"),
        end(),
        field("c2", "B"),
        end(),
        field("f2", "Email"),
      );
      const { actions, setItems } = setup(items, "f1", true);
      actions.down!();
      expect(setItems.mock.calls[0]![0]).toEqual(
        flat(
          section("s1", "Main"),
          field("p1", "Panel", { n: 2, deleted: true }),
          field("c1", "A"),
          end(),
          field("c2", "B"),
          end(),
          field("f2", "Email"),
          field("f1", "Name"),
        ),
      );
    });

    it("without jump: still steps one flat entry at a time (into the panel header slot)", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("p1", "Panel", { n: 2, deleted: true }),
        field("c1", "A"),
        end(),
      );
      const { actions, setItems } = setup(items, "f1", false);
      actions.down!();
      expect(setItems.mock.calls[0]![0]).toEqual(
        flat(
          section("s1", "Main"),
          field("p1", "Panel", { n: 2, deleted: true }),
          field("f1", "Name"),
          field("c1", "A"),
          end(),
        ),
      );
    });

    it("is not null when a trailing soft-deleted panel is the only thing below (jump skips it entirely)", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("p1", "Panel", { n: 1, deleted: true }),
        field("c1", "A"),
        end(),
      );
      expect(setup(items, "f1", true).actions.down).toBeNull();
    });
  });

  describe("up", () => {
    it("swaps with the previous live leaf", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("f2", "Email"),
      );
      const { actions, setItems } = setup(items, "f2");
      actions.up!();
      expect(setItems.mock.calls[0]![0]).toEqual(
        flat(section("s1", "Main"), field("f2", "Email"), field("f1", "Name")),
      );
    });

    it("with jump: skips a soft-deleted panel above as a whole, landing before it", () => {
      const items = flat(
        section("s1", "Main"),
        field("f0", "Title"),
        field("p1", "Panel", { n: 1, deleted: true }),
        field("c1", "A"),
        end(),
        field("f1", "Name"),
      );
      const { actions, setItems } = setup(items, "f1", true);
      actions.up!();
      expect(setItems.mock.calls[0]![0]).toEqual(
        flat(
          section("s1", "Main"),
          field("f1", "Name"),
          field("f0", "Title"),
          field("p1", "Panel", { n: 1, deleted: true }),
          field("c1", "A"),
          end(),
        ),
      );
    });

    it("with jump: up is undefined when only a soft-deleted panel sits above (would otherwise cross the section boundary)", () => {
      const items = flat(
        section("s1", "Main"),
        field("p1", "Panel", { n: 2, deleted: true }),
        field("c1", "A"),
        end(),
        field("c2", "B"),
        end(),
        field("f1", "Name"),
      );
      expect(setup(items, "f1", true).actions.up).toBeUndefined();
    });

    it("is null at the top", () => {
      const items = flat(section("s1", "Main"), field("f1", "Name"));
      expect(setup(items, "f1").actions.up).toBeUndefined();
    });
  });
});
