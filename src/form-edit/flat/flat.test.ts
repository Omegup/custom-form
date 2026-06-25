import { describe, expect, it } from "vitest";
import type { TheParams } from "../_deps";
import { EDIT_FORM_INITIAL } from "../demo/fixtures";
import type { MetaDom } from "../_deps";
import { getFlatInsertionIndex } from "./getFlatInsertionIndex";
import { consolidateSections, customConsolidateSections, type SIndexed } from "./consolidate";
import type { FlatFormItem } from "./flat-form.t";
import { flatten } from "./flatten";

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
): FlatFormItem<TypeNames, Params, Section> => ({
  section: { id, deleted: false, title, description: "" },
});

const field = (
  id: string,
  name: string,
  n = 0,
): FlatFormItem<TypeNames, Params, Section> => ({
  item: { id, type: "field", params: { name }, deleted: false },
  n,
});

const end = (): FlatFormItem<TypeNames, Params, Section> => ({ end: null });

const flat = (...entries: FlatFormItem<TypeNames, Params, Section>[]) =>
  entries;

const flattenTree = flatten<TypeNames, Params, Section, MetaDom<SIndexed>>();

describe("consolidateSections", () => {
  it("groups flat items into sections with column slots", () => {
    const sections = consolidateSections(EDIT_FORM_INITIAL);
    expect(sections).toHaveLength(2);
    expect(sections[0]!.header.title).toBe("Personal");
    expect(sections[0]!.items[0]![0]!.header.params.name).toBe("Name");
    expect(sections[0]!.items[1]![0]!.header.params.name).toBe("Email");
    expect(sections[1]!.header.title).toBe("Details");
    expect(sections[1]!.items[0]![0]!.header.params.name).toBe("Notes");
  });

  it("throws when the flat list does not start with a section", () => {
    expect(() => consolidateSections(flat(field("f1", "Orphan")))).toThrow(
      "First item must be a section",
    );
    expect(() => consolidateSections(flat())).toThrow(
      "First item must be a section",
    );
  });

  it("exposes column slots via items.length", () => {
    const sections = consolidateSections(EDIT_FORM_INITIAL);
    expect(sections[0]!.items).toHaveLength(2);
    expect(sections[1]!.items).toHaveLength(1);
  });

  it("assigns flat-stream meta on items for column insert-index math", () => {
    const sections = consolidateSections(EDIT_FORM_INITIAL);
    const personal = sections[0]!;

    expect(personal.items[0]![0]!.meta).toEqual({
      index: 1,
      total: 1,
      sIndex: 0,
    });
    expect(personal.items[1]![0]!.meta).toEqual({
      index: 3,
      total: 1,
      sIndex: 0,
    });

    expect(getFlatInsertionIndex(personal.meta.index, personal.items, 0)).toBe(
      2,
    );
    expect(getFlatInsertionIndex(personal.meta.index, personal.items, 1)).toBe(
      4,
    );
  });

  it("assigns item meta.sIndex from the section it landed in", () => {
    const sections = consolidateSections(EDIT_FORM_INITIAL);
    expect(sections[0]!.items[0]![0]!.meta.sIndex).toBe(0);
    expect(sections[0]!.items[1]![0]!.meta.sIndex).toBe(0);
    expect(sections[1]!.items[0]![0]!.meta.sIndex).toBe(1);
  });

  it("nests children under a parent when n > 0", () => {
    const nested = flat(
      section("s1", "Nested"),
      field("parent", "Parent", 1),
      field("child", "Child"),
      end(),
      end(),
    );

    const sections = consolidateSections(nested);
    const parent = sections[0]!.items[0]![0]!;

    expect(parent.header.params.name).toBe("Parent");
    expect(parent.children).toHaveLength(1);
    expect(parent.children[0]).toHaveLength(1);
    expect(parent.children[0]![0]!.header.params.name).toBe("Child");
  });

  it("supports three sibling columns in one section", () => {
    const threeCols = flat(
      section("s1", "Wide"),
      field("a", "A"),
      end(),
      field("b", "B"),
      end(),
      field("c", "C"),
    );

    const sections = consolidateSections(threeCols);
    expect(sections[0]!.items).toHaveLength(3);
    expect(sections[0]!.items.map((col) => col[0]!.header.params.name)).toEqual(
      ["A", "B", "C"],
    );
  });

  it("applies custom header and section mappers", () => {
    const sections = customConsolidateSections(
      EDIT_FORM_INITIAL,
      (item) => ({
        ...item,
        header: {
          ...item.header,
          params: { name: `${item.header.params.name}!` },
        },
      }),
      (s) => ({
        ...s,
        header: { ...s.header, title: `${s.header.title}!` },
      }),
    );

    expect(sections[0]!.header.title).toBe("Personal!");
    expect(sections[0]!.items[0]![0]!.header.params.name).toBe("Name!");
  });
});

describe("flatten", () => {
  it("re-encodes a consolidated section back to its flat markers", () => {
    const sections = consolidateSections(EDIT_FORM_INITIAL);

    expect(flattenTree.section(sections[0]!)).toEqual([
      EDIT_FORM_INITIAL[0],
      EDIT_FORM_INITIAL[1],
      EDIT_FORM_INITIAL[2],
      EDIT_FORM_INITIAL[3],
    ]);
    expect(flattenTree.section(sections[1]!)).toEqual([
      EDIT_FORM_INITIAL[4],
      EDIT_FORM_INITIAL[5],
    ]);
  });

  it("re-encodes a nested item subtree without the outer column end marker", () => {
    const nested = flat(
      section("s1", "Nested"),
      field("parent", "Parent", 1),
      field("child", "Child"),
      end(),
      end(),
    );
    const parent = consolidateSections(nested)[0]!.items[0]![0]!;

    expect(flattenTree.formItem(parent)).toEqual([
      { item: parent.header, n: 1 },
      { item: parent.children[0]![0]!.header, n: 0 },
      { end: null },
    ]);
  });

  it("round-trips a full flat document through consolidate then per-section flatten", () => {
    const sections = consolidateSections(EDIT_FORM_INITIAL);
    const roundTripped = sections.flatMap((s) => flattenTree.section(s));

    expect(roundTripped).toEqual(EDIT_FORM_INITIAL);
  });
});
