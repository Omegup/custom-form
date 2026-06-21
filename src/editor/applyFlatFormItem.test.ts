import { describe, expect, it } from "vitest";
import { consolidateSections } from "../form-edit";
import { branded } from "../form/branded";
import type { RecursiveFormItem } from "../recursive-form";
import {
  EDIT_FORM_INITIAL,
  type EditFormFieldParams,
  type EditFormFieldTypeNames,
  type EditFormItemMeta,
  type EditFormSection,
} from "../form-edit/fixtures";
import { applyFlatFormItem } from "./applyFlatFormItem";

const makeAddItem = (
  id: string,
  name: string,
  meta: { index: number; total: number; sIndex: number },
): RecursiveFormItem<EditFormFieldTypeNames, EditFormFieldParams, EditFormItemMeta> => ({
  meta: branded(meta),
  header: branded({
    id,
    type: "field" as const,
    params: { name },
    deleted: false,
  }),
  children: [],
});

describe("applyFlatFormItem", () => {
  it("appends a sidebar item (meta.index -1) into the first section", () => {
    const editing = makeAddItem("new1", "New field", {
      index: -1,
      total: 0,
      sIndex: -1,
    });
    const saved = makeAddItem("new1", "New field", {
      index: -1,
      total: 0,
      sIndex: -1,
    });

    const next = applyFlatFormItem(EDIT_FORM_INITIAL, editing, saved, saved.children.length);
    const itemEntries = next.filter((fi) => "item" in fi);

    expect(itemEntries.some((fi) => "item" in fi && fi.item.id === "new1")).toBe(true);
    expect(next.length).toBeGreaterThan(EDIT_FORM_INITIAL.length);

    const sections = consolidateSections<
      EditFormFieldTypeNames,
      EditFormFieldParams,
      EditFormSection
    >(next);
    const personal = sections.find((s) => s.header.id === "s1");
    const names = personal?.items.flat().map((n) => n.header.params.name) ?? [];
    expect(names).toContain("New field");
  });

  it("splices at meta.index when adding into a column slot", () => {
    const editing = makeAddItem("col1", "Column field", {
      index: 3,
      total: 0,
      sIndex: 0,
    });
    const saved = makeAddItem("col1", "Column field", {
      index: 3,
      total: 0,
      sIndex: 0,
    });

    const next = applyFlatFormItem(EDIT_FORM_INITIAL, editing, saved, saved.children.length);
    expect(next.filter((fi) => "item" in fi && fi.item.id === "col1")).toHaveLength(1);
  });

  it("uses children.length for cols so leaf fields stay n:0", () => {
    const editing = makeAddItem("leaf1", "Leaf", { index: -1, total: 0, sIndex: -1 });
    const saved = makeAddItem("leaf1", "Leaf", { index: -1, total: 0, sIndex: -1 });

    const next = applyFlatFormItem(EDIT_FORM_INITIAL, editing, saved, 0);
    const entry = next.find((fi) => "item" in fi && fi.item.id === "leaf1");
    expect(entry && "item" in entry && entry.n).toBe(0);
  });
});
