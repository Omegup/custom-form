import { describe, expect, it } from "vitest";
import { AMBIGUOUS_INSERT_SPAN, openFormItemInsertSession } from "../form-edit";
import type { TheParams } from "./_deps";
import { createBlankFormItem } from "./createBlankFormItem";
import type { MenuItemDefinition } from "./MenuItemDefinition.t";

type TypeNames = "field" | "panel";
type Params = TheParams<{ field: { name: string }; panel: { name: string } }>;

const random = () => "id_1";

const fieldDef: MenuItemDefinition<TypeNames, Params> = {
  title: "Field",
  header: { type: "field", params: { name: "" } },
};

const panelDef: MenuItemDefinition<TypeNames, Params> = {
  title: "Panel",
  n: 2,
  header: { type: "panel", params: { name: "" } },
};

describe("createBlankFormItem", () => {
  it("stamps a fresh id and empty column slots from the definition", () => {
    expect(createBlankFormItem(panelDef, random)).toEqual({
      header: {
        id: "id_1",
        type: "panel",
        params: { name: "" },
        deleted: false,
      },
      children: [[], []],
    });
  });

  it("defaults to zero column slots", () => {
    expect(createBlankFormItem(fieldDef, random).children).toEqual([]);
  });

  it("creates distinct arrays per column slot", () => {
    const { children } = createBlankFormItem(panelDef, random);
    expect(children[0]).not.toBe(children[1]);
  });

  it("feeds openFormItemInsertSession with AMBIGUOUS_INSERT_SPAN", () => {
    const session = openFormItemInsertSession(
      createBlankFormItem(fieldDef, random),
      AMBIGUOUS_INSERT_SPAN,
    );
    expect(session).toEqual({
      draft: {
        item: { id: "id_1", type: "field", params: { name: "" }, deleted: false },
        n: 0,
      },
      children: [],
      index: -1,
      total: 0,
      sIndex: -1,
    });
  });
});
