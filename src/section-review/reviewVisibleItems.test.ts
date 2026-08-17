import { describe, expect, it } from "vitest";
import type { TheParams } from "../form";
import type { MetaDom, RecursiveFormItem, SIndexed } from "./_deps";
import { usefulForReview } from "./reviewVisibleItems";

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

describe("usefulForReview", () => {
  it("drops unanswered deleted rows", () => {
    expect(usefulForReview(field("a"), () => false)).toBe(true);
    expect(usefulForReview(field("gone", true), () => false)).toBe(false);
  });

  it("keeps deleted rows that have an answer", () => {
    expect(usefulForReview(field("gone", true), (id) => id === "gone")).toBe(
      true,
    );
  });
});
