import { describe, expect, it } from "vitest";
import { extrasByItemId } from "./extrasByItemId";

type Item = { header: { id: string }; children: Item[][] };

const item = (id: string, children: Item[][] = []): Item => ({
  header: { id },
  children,
});

describe("extrasByItemId", () => {
  it("keys extras for nested items", () => {
    const nested = item("child");
    const panel = item("panel", [[nested]]);
    const field = item("field");
    const map = extrasByItemId([{ items: [[field, panel]] }], (node) =>
      node.header.id.toUpperCase(),
    );
    expect(Object.fromEntries(map)).toEqual({
      field: "FIELD",
      panel: "PANEL",
      child: "CHILD",
    });
  });
});
