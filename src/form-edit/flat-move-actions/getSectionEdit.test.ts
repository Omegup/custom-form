import { describe, expect, it, vi } from "vitest";
import type { ContextDom, TheParams } from "../_deps";
import { branded } from "../_deps";
import { autofocusCtx } from "../../move-actions";
import { buildItemSectionDict } from "../flat/buildItemSectionDict";
import { consolidateSections } from "../flat/consolidate";
import type { FlatNestedItem } from "../flat/flat-form.t";
import { getSectionEdit } from "./getSectionEdit";

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

const flat = (...xs: FlatNestedItem<TypeNames, Params, Section>[]) => xs;

const fieldHeader = (id: string, name: string) => ({
  id,
  type: "field" as const,
  params: { name },
  deleted: false,
});

const setup = (
  items: FlatNestedItem<TypeNames, Params, Section>[],
  sectionId: string,
  jump = true,
) => {
  const setItems = vi.fn();
  const ctx = autofocusCtx(branded<Record<string, never>, "context">({}), null);
  const clone = (sub: typeof items) => sub;
  const args = {
    items,
    setItems,
    ctx,
    sectionOfItem: buildItemSectionDict(items),
    setToRemove: () => {},
  };
  const sections = consolidateSections(items);
  const sIndex = sections.findIndex((s) => s.header.id === sectionId);
  const target = sections[sIndex]!;
  const edit = getSectionEdit<TypeNames, Params, ContextDom, Section>(
    args,
    clone,
    target,
    sIndex,
    jump,
  );
  return { edit, setItems, target, sIndex };
};

describe("getSectionEdit", () => {
  it("bundles item, autofocus, actions and nodes for a section", () => {
    const items = flat(
      section("s1", "Main"),
      field("f1", "Name"),
      field("f2", "Email"),
      section("s2", "Details"),
      field("f3", "Notes"),
    );
    const { edit, sIndex } = setup(items, "s1");

    expect(edit.item).toEqual({
      id: "s1",
      deleted: false,
      title: "Main",
      description: "",
    });
    expect(edit.autofocus).toBeNull();
    expect(sIndex).toBe(0);
    expect(edit.nodes).toEqual({
      index: 0,
      total: 3,
      sIndex: 0,
      children: [
        [
          expect.objectContaining({ header: fieldHeader("f1", "Name") }),
          expect.objectContaining({ header: fieldHeader("f2", "Email") }),
        ],
      ],
    });
    expect(edit.actions.up).toBeNull();
    expect(edit.actions.down).toBeInstanceOf(Function);
  });

  it("reflects the passed section ordinal in nodes.sIndex", () => {
    const items = flat(
      section("s1", "Main"),
      field("f1", "Name"),
      section("s2", "Details"),
      field("f2", "Notes"),
    );
    const { edit, sIndex } = setup(items, "s2");
    expect(sIndex).toBe(1);
    expect(edit.nodes.sIndex).toBe(1);
    expect(edit.nodes.index).toBe(2);
    expect(edit.nodes.total).toBe(2);
  });

  it("setNodes rewrites the section's own span in the flat list", () => {
    const items = flat(
      section("s1", "Main"),
      field("f1", "Name"),
      field("f2", "Email"),
      section("s2", "Details"),
      field("f3", "Notes"),
    );
    const { edit, setItems } = setup(items, "s1");

    // Swap the two top-level fields within the (single) column.
    const [col0] = edit.nodes.children;
    edit.setNodes({ ...edit.nodes, children: [[col0![1]!, col0![0]!]] });

    expect(setItems.mock.calls[0]![0]).toEqual(
      flat(
        section("s1", "Main"),
        field("f2", "Email"),
        field("f1", "Name"),
        section("s2", "Details"),
        field("f3", "Notes"),
      ),
    );
    // Pure — the input list is untouched.
    expect(items[1]).toEqual(field("f1", "Name"));
  });

  it("resetAutofocus dispatches setItems with a cleared autofocus ctx", () => {
    const items = flat(section("s1", "Main"), field("f1", "Name"));
    const { edit, setItems } = setup(items, "s1");
    edit.resetAutofocus();
    expect(setItems).toHaveBeenCalledTimes(1);
    expect(setItems.mock.calls[0]![0]).toBe(items);
    expect(setItems.mock.calls[0]![1]).toMatchObject({ focused: null });
  });
});
