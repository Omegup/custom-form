import { describe, expect, it } from "vitest";
import type { TheParams } from "../_deps";
import { applyFlatFormItem } from "./applyFlatFormItem";
import { consolidateSections } from "./consolidate";
import type { FlatNestedItem } from "./flat-form.t";
import { getFlatInsertionIndex } from "./getFlatInsertionIndex";
import {
  openFormItemEditSession,
  openFormItemInsertSession,
} from "./openFormItemEditSession";

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
): FlatNestedItem<TypeNames, Params, Section> => ({
  section: { id, deleted: false, title, description: "" },
});

const header = (id: string, name: string) => ({
  id,
  type: "field" as const,
  params: { name },
  deleted: false,
});

const field = (
  id: string,
  name: string,
  n = 0,
): FlatNestedItem<TypeNames, Params, Section> => ({
  item: header(id, name),
  n,
});

const end = (): FlatNestedItem<TypeNames, Params, Section> => ({ end: null });

const flat = (...entries: FlatNestedItem<TypeNames, Params, Section>[]) =>
  entries;

describe("applyFlatFormItem", () => {
  it("replaces the edited item span in place", () => {
    const items = flat(
      section("s1", "Main"),
      field("f1", "Name"),
      end(),
      field("f2", "Email"),
    );
    const item = consolidateSections(items)[0]!.items[0]![0]!;
    const session = openFormItemEditSession(item);

    const next = applyFlatFormItem(
      items,
      session,
      {
        header: { ...session.draft.item, params: { name: "Full name" } },
        children: session.children,
      },
      session.draft.n,
    );

    expect(next).toEqual(
      flat(
        section("s1", "Main"),
        field("f1", "Full name"),
        end(),
        field("f2", "Email"),
      ),
    );
    expect(items[1]).toEqual(field("f1", "Name"));
  });

  it("merges child columns when cols shrink from 2 to 1", () => {
    const items = flat(
      section("s1", "Main"),
      field("p1", "Panel", 2),
      field("c1", "A"),
      end(),
      field("c2", "B"),
      end(),
    );
    const panel = consolidateSections(items)[0]!.items[0]![0]!;
    const session = openFormItemEditSession(panel);
    expect(session).toMatchObject({ index: 1, total: 5, sIndex: 0 });
    expect(session.draft.n).toBe(2);

    const next = applyFlatFormItem(
      items,
      session,
      { header: session.draft.item, children: session.children },
      1,
    );

    expect(next).toEqual(
      flat(
        section("s1", "Main"),
        field("p1", "Panel", 1),
        field("c1", "A"),
        field("c2", "B"),
        end(),
      ),
    );
  });

  it("inserts a new item at the end of section sIndex when index === -1", () => {
    const items = flat(
      section("s1", "Main"),
      field("f1", "Name"),
      section("s2", "Details"),
      field("f2", "Notes"),
    );

    const intoFirst = applyFlatFormItem(
      items,
      { index: -1, total: 0, sIndex: 0 },
      { header: header("new", "Phone"), children: [] },
      0,
    );
    expect(intoFirst).toEqual(
      flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("new", "Phone"),
        section("s2", "Details"),
        field("f2", "Notes"),
      ),
    );

    const intoLast = applyFlatFormItem(
      items,
      { index: -1, total: 0, sIndex: 1 },
      { header: header("new", "Phone"), children: [] },
      0,
    );
    expect(intoLast).toEqual(
      flat(
        section("s1", "Main"),
        field("f1", "Name"),
        section("s2", "Details"),
        field("f2", "Notes"),
        field("new", "Phone"),
      ),
    );
  });

  it("inserts at a column slot (getFlatInsertionIndex + insert session)", () => {
    const items = flat(
      section("s1", "Main"),
      field("f1", "Name"),
      end(),
      field("f2", "Email"),
    );
    const main = consolidateSections(items)[0]!;
    const newItem = { header: header("new", "Phone"), children: [] };

    const session = openFormItemInsertSession(newItem, {
      index: getFlatInsertionIndex(main.meta.index, main.items, 0),
      sIndex: 0,
    });
    expect(session).toMatchObject({ index: 2, total: 0, sIndex: 0 });

    const next = applyFlatFormItem(items, session, newItem, session.draft.n);
    expect(next).toEqual(
      flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("new", "Phone"),
        end(),
        field("f2", "Email"),
      ),
    );
  });
});
