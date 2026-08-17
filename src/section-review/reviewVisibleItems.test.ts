import { describe, expect, it } from "vitest";
import type { TheParams } from "../form";
import type { MetaDom, RecursiveFormItem, SIndexed } from "./_deps";
import { usefulForReview, withIdSuffix } from "./reviewVisibleItems";

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

describe("withIdSuffix", () => {
  it("suffixes header ids under a panel instance", () => {
    expect(withIdSuffix(field("a"), "__p").header.id).toBe("a__p");
  });

  it("leaves the item unchanged when the suffix is empty", () => {
    const item = field("a");
    expect(withIdSuffix(item, "")).toBe(item);
  });
});
