import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ContextDom, TheParams } from "./_deps";
import { branded, consolidateSections } from "./_deps";
import type { FlatFormItems, FlatNestedItem } from "../form-edit";
import type { ItemDialogArgs, SectionDialogArgs } from "./makeUseDialogs";
import { makeUseDialogs } from "./makeUseDialogs";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Section = {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
};
type Entry = FlatNestedItem<TypeNames, Params, Section>;

const section = (id: string, title: string, deleted = false): Entry => ({
  section: { id, deleted, title, description: "" },
});

const header = (id: string, name: string) => ({
  id,
  type: "field" as const,
  params: { name },
  deleted: false,
});

const field = (id: string, name: string, n = 0): Entry => ({
  item: header(id, name),
  n,
});

const end = (): Entry => ({ end: null });

const flat = (...xs: Entry[]) => xs;

const ctx: ContextDom = branded<Record<string, never>, "context">({});

const setup = (items: FlatFormItems<TypeNames, Params, Section>) => {
  let itemArgs: ItemDialogArgs<TypeNames, Params, ContextDom, Section> | null =
    null;
  let sectionArgs: SectionDialogArgs<TypeNames, Params, Section> | null = null;
  const useDialogs = makeUseDialogs<TypeNames, Params, ContextDom, Section>({
    renderFormItem: (args) => {
      itemArgs = args;
      return "item-dialog";
    },
    renderSection: (args) => {
      sectionArgs = args;
      return "section-dialog";
    },
  });
  const setFlatItems = vi.fn();
  const { result } = renderHook(() =>
    useDialogs({ flatItems: items, setFlatItems, ctx }),
  );
  return {
    result,
    setFlatItems,
    itemArgs: () => {
      if (!itemArgs) throw new Error("item dialog not rendered");
      return itemArgs;
    },
    sectionArgs: () => {
      if (!sectionArgs) throw new Error("section dialog not rendered");
      return sectionArgs;
    },
  };
};

const findItem = (
  items: FlatFormItems<TypeNames, Params, Section>,
  id: string,
) => {
  for (const s of consolidateSections(items))
    for (const col of s.items)
      for (const node of col) if (node.header.id === id) return node;
  throw new Error(`item ${id} not found`);
};

describe("makeUseDialogs", () => {
  it("renders no dialog until a session opens", () => {
    const { result } = setup(flat(section("s1", "Main"), field("f1", "Name")));
    expect(result.current.formItemDialog).toBeNull();
    expect(result.current.sectionDialog).toBeNull();
  });

  describe("item dialog", () => {
    it("openItemEdit: add is false; commit replaces the span and closes", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("f2", "Email"),
      );
      const { result, setFlatItems, itemArgs } = setup(items);

      act(() => result.current.openItemEdit(findItem(items, "f1")));
      expect(result.current.formItemDialog).toBe("item-dialog");
      expect(itemArgs().add).toBe(false);

      act(() =>
        itemArgs().commit({ item: header("f1", "Full name"), n: 0 }),
      );
      expect(setFlatItems).toHaveBeenCalledWith(
        flat(
          section("s1", "Main"),
          field("f1", "Full name"),
          field("f2", "Email"),
        ),
      );
      expect(result.current.formItemDialog).toBeNull();
    });

    it("openItemInsert without span: add is true (section picker case); commit appends to the first live section", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        section("s2", "Details"),
        field("f2", "Notes"),
      );
      const { result, setFlatItems, itemArgs } = setup(items);

      act(() =>
        result.current.openItemInsert({
          header: header("new", "Phone"),
          children: [],
        }),
      );
      expect(itemArgs().add).toBe(true);

      act(() => itemArgs().commit({ item: header("new", "Phone"), n: 0 }));
      expect(setFlatItems).toHaveBeenCalledWith(
        flat(
          section("s1", "Main"),
          field("f1", "Name"),
          field("new", "Phone"),
          section("s2", "Details"),
          field("f2", "Notes"),
        ),
      );
    });

    it("setSIndex retargets an ambiguous insert to the picked section", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        section("s2", "Details"),
        field("f2", "Notes"),
      );
      const { result, setFlatItems, itemArgs } = setup(items);

      act(() =>
        result.current.openItemInsert({
          header: header("new", "Phone"),
          children: [],
        }),
      );
      // Pick the second section (flat marker index 2 — school selectSection value).
      act(() => itemArgs().setSIndex(2));
      expect(itemArgs().session.sIndex).toBe(2);

      act(() => itemArgs().commit({ item: header("new", "Phone"), n: 0 }));
      expect(setFlatItems).toHaveBeenCalledWith(
        flat(
          section("s1", "Main"),
          field("f1", "Name"),
          section("s2", "Details"),
          field("f2", "Notes"),
          field("new", "Phone"),
        ),
      );
    });

    it("openItemInsert with a concrete slot span: add is false; commit inserts at that flat index", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("f2", "Email"),
      );
      const { result, setFlatItems, itemArgs } = setup(items);

      act(() =>
        result.current.openItemInsert(
          { header: header("new", "Phone"), children: [] },
          { index: 2, sIndex: 0 },
        ),
      );
      expect(itemArgs().add).toBe(false);

      act(() => itemArgs().commit({ item: header("new", "Phone"), n: 0 }));
      expect(setFlatItems).toHaveBeenCalledWith(
        flat(
          section("s1", "Main"),
          field("f1", "Name"),
          field("new", "Phone"),
          field("f2", "Email"),
        ),
      );
    });

    it("setDraft updates the session draft; close discards without saving", () => {
      const items = flat(section("s1", "Main"), field("f1", "Name"));
      const { result, setFlatItems, itemArgs } = setup(items);

      act(() => result.current.openItemEdit(findItem(items, "f1")));
      act(() =>
        itemArgs().setDraft((prev) => ({
          ...prev,
          item: { ...prev.item, params: { name: "Renamed" } },
        })),
      );
      expect(itemArgs().session.draft.item.params.name).toBe("Renamed");

      act(() => itemArgs().close());
      expect(result.current.formItemDialog).toBeNull();
      expect(setFlatItems).not.toHaveBeenCalled();
    });
  });

  describe("section dialog", () => {
    it("openSectionEdit: add is false; commit saves header + cols and closes", () => {
      const items = flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("f2", "Email"),
      );
      const { result, setFlatItems, sectionArgs } = setup(items);

      act(() =>
        result.current.openSectionEdit(consolidateSections(items)[0]!),
      );
      expect(result.current.sectionDialog).toBe("section-dialog");
      expect(sectionArgs().add).toBe(false);

      act(() =>
        sectionArgs().commit(
          { id: "s1", deleted: false, title: "Renamed", description: "d" },
          2,
        ),
      );
      // cols 1 → 2 adds a column separator; flatten drops the trailing end.
      expect(setFlatItems).toHaveBeenCalledWith(
        flat(
          {
            section: {
              id: "s1",
              deleted: false,
              title: "Renamed",
              description: "d",
            },
          },
          field("f1", "Name"),
          field("f2", "Email"),
          end(),
        ),
      );
      expect(result.current.sectionDialog).toBeNull();
    });

    it("openSectionAdd: add is true; commit appends the new section", () => {
      const items = flat(section("s1", "Main"), field("f1", "Name"));
      const { result, setFlatItems, sectionArgs } = setup(items);

      act(() =>
        result.current.openSectionAdd({
          header: { id: "s2", deleted: false, title: "", description: "" },
          index: -1,
          total: 0,
          items: [[]],
        }),
      );
      expect(sectionArgs().add).toBe(true);

      act(() =>
        sectionArgs().commit(
          { id: "s2", deleted: false, title: "Details", description: "" },
          1,
        ),
      );
      expect(setFlatItems).toHaveBeenCalledWith(
        flat(
          section("s1", "Main"),
          field("f1", "Name"),
          section("s2", "Details"),
        ),
      );
    });

    it("close discards without saving", () => {
      const items = flat(section("s1", "Main"), field("f1", "Name"));
      const { result, setFlatItems, sectionArgs } = setup(items);

      act(() =>
        result.current.openSectionEdit(consolidateSections(items)[0]!),
      );
      act(() => sectionArgs().close());
      expect(result.current.sectionDialog).toBeNull();
      expect(setFlatItems).not.toHaveBeenCalled();
    });
  });

  it("sectionOptions lists live sections only, keyed by flat marker index", () => {
    const items = flat(
      section("s1", "Main"),
      field("f1", "Name"),
      section("s2", "Gone", true),
      section("s3", "Details"),
    );
    const { result } = setup(items);
    expect(result.current.sectionOptions).toEqual([
      { index: 0, header: { id: "s1", deleted: false, title: "Main", description: "" } },
      { index: 3, header: { id: "s3", deleted: false, title: "Details", description: "" } },
    ]);
  });
});
