import { describe, expect, it } from "vitest";
import { branded } from "../form/branded";
import type { RecursiveFormItem } from "../recursive-form";
import {
  EDIT_FORM_INITIAL,
  type EditFormFieldParams,
  type EditFormFieldTypeNames,
  type EditFormItemMeta,
} from "../form-edit/fixtures";
import { insertFlatFormItem } from "./insertFlatFormItem";

const makeItem = (
  id: string,
  meta: { index: number; total: number; sIndex: number },
): RecursiveFormItem<EditFormFieldTypeNames, EditFormFieldParams, EditFormItemMeta> => ({
  meta: branded(meta),
  header: branded({
    id,
    type: "field" as const,
    params: { name: "Sidebar field" },
    deleted: false,
  }),
  children: [],
});

describe("insertFlatFormItem", () => {
  it("appends to the first section when meta.index is -1", () => {
    const item = makeItem("side1", { index: -1, total: 0, sIndex: -1 });
    const next = insertFlatFormItem(EDIT_FORM_INITIAL, item);
    expect(next.some((fi) => "item" in fi && fi.item.id === "side1")).toBe(true);
  });

  it("splices at meta.index for column add", () => {
    const item = makeItem("col1", { index: 3, total: 0, sIndex: 0 });
    const next = insertFlatFormItem(EDIT_FORM_INITIAL, item);
    expect(next.findIndex((fi) => "item" in fi && fi.item.id === "col1")).toBe(3);
  });
});
