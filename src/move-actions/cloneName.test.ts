import { describe, expect, it } from "vitest";
import { cloneName } from "./cloneName";

describe("cloneName", () => {
  it("appends clone suffix for the first duplicate", () => {
    const items = [{ name: "Item 1" }];
    expect(cloneName(items[0]!, items, (x) => x.name, (n, s) => `${n} (clone${s})`)).toBe(
      "Item 1 (clone)",
    );
  });

  it("increments clone suffix when copies already exist", () => {
    const items = [
      { name: "Item 1" },
      { name: "Item 1 (clone)" },
      { name: "Item 1 (clone 2)" },
    ];
    expect(cloneName(items[0]!, items, (x) => x.name, (n, s) => `${n} (clone${s})`)).toBe(
      "Item 1 (clone 3)",
    );
  });
});
