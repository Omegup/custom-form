import { describe, expect, it } from "vitest";
import type { TheParams } from "../form";
import type { MetaDom, RecursiveFormItem, SIndexed } from "./_deps";
import { usefulForFill } from "./responderRender";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;

const field = (
  id: string,
  deleted = false,
): RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>> => ({
  header: { id, type: "field", params: { name: id }, deleted },
  children: [],
  meta: { index: 0, total: 1, sIndex: 0 },
});

describe("usefulForFill", () => {
  it("keeps live rows", () => {
    expect(usefulForFill(field("a"), {})).toBe(true);
  });

  it("drops unanswered deleted rows", () => {
    expect(usefulForFill(field("gone", true), {})).toBe(false);
    expect(
      usefulForFill(field("gone", true), { gone: { meta: {}, data: {} } }),
    ).toBe(false);
  });

  it("keeps deleted rows that have answer data", () => {
    expect(
      usefulForFill(field("gone", true), {
        gone: { meta: {}, data: { value: "x" } },
      }),
    ).toBe(true);
  });
});
