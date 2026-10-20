import { describe, expect, it } from "vitest";
import { branded } from "../form";
import type { TheParams } from "../form";
import type { RecursiveFormItem } from "./RecursiveFormItem.t";
import { withIdSuffix } from "./withIdSuffix";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Meta = { meta: { index: number } };

const field = (
  id: string,
): RecursiveFormItem<TypeNames, Params, Meta> => ({
  header: { id, type: "field", params: { name: id }, deleted: false },
  children: [],
  meta: branded({ index: 0 }),
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
