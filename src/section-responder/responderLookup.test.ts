import { describe, expect, it } from "vitest";
import type { TheParams } from "../form";
import type { MetaDom, RecursiveFormItem, SIndexed } from "./_deps";
import { followUpsForOrigin, oldById } from "./responderLookup";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;

const field = (
  id: string,
): RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>> => ({
  header: { id, type: "field", params: { name: id }, deleted: false },
  children: [],
  meta: { index: 0, total: 1, sIndex: 0 },
});

describe("oldById", () => {
  it("prefers the instance id then the design base", () => {
    const bag = { a: 1, "a:0": 2 };
    expect(oldById(bag, "a:0")).toBe(2);
    expect(oldById(bag, "a")).toBe(1);
    expect(oldById(bag, "missing")).toBeNull();
    expect(oldById(undefined, "a")).toBeNull();
  });
});

describe("followUpsForOrigin", () => {
  const fu = [field("fu")];

  it("matches the exact origin key", () => {
    expect(followUpsForOrigin({ a: fu }, "a")).toEqual(fu);
  });

  it("falls back to the unsuffixed design id", () => {
    expect(followUpsForOrigin({ a: fu }, "a:0")).toEqual(fu);
  });

  it("matches any stored key with the same base", () => {
    expect(followUpsForOrigin({ "a:1": fu }, "a:0")).toEqual(fu);
  });

  it("returns an empty list when nothing matches", () => {
    expect(followUpsForOrigin({ b: fu }, "a")).toEqual([]);
  });
});
